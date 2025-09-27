#!/usr/bin/env python3
"""Utility to poll the Django dependency health command."""

from __future__ import annotations

import argparse
import json
import logging
import os
import subprocess
import sys
import time
from typing import Dict

DEFAULT_MANAGE_PATH = os.path.join("apps", "api", "manage.py")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Run the Plane dependency health check command once or on an interval."
        )
    )
    parser.add_argument(
        "--manage-path",
        default=DEFAULT_MANAGE_PATH,
        help=(
            "Path to manage.py. Defaults to apps/api/manage.py relative to the repository root."
        ),
    )
    parser.add_argument(
        "--python",
        default=sys.executable,
        help="Python interpreter to use when invoking manage.py",
    )
    parser.add_argument(
        "--interval",
        type=float,
        default=0,
        help="Seconds between checks. Set to 0 to run a single check and exit.",
    )
    parser.add_argument(
        "--timeout",
        type=float,
        default=5.0,
        help="Maximum seconds the health command should wait per dependency.",
    )
    parser.add_argument(
        "--fail-fast",
        action="store_true",
        help="Exit immediately if a dependency is reported unhealthy.",
    )
    return parser.parse_args()


def run_check(manage_path: str, python: str, timeout: float) -> Dict[str, Dict[str, object]]:
    command = [
        python,
        manage_path,
        "monitor_services",
        "--json",
        "--timeout",
        str(timeout),
    ]

    process = subprocess.run(
        command,
        capture_output=True,
        text=True,
        check=False,
    )

    if process.returncode != 0:
        logging.error("monitor_services exited with code %s", process.returncode)
        if process.stdout:
            logging.error("stdout: %s", process.stdout.strip())
        if process.stderr:
            logging.error("stderr: %s", process.stderr.strip())
        raise RuntimeError("monitor_services command failed")

    try:
        payload = json.loads(process.stdout)
    except json.JSONDecodeError as exc:  # pragma: no cover - defensive guard
        logging.error("Failed to parse JSON output: %s", exc)
        logging.debug("Raw output: %s", process.stdout)
        raise RuntimeError("Invalid JSON from monitor_services") from exc

    return payload


def log_summary(result: Dict[str, Dict[str, object]]) -> None:
    for component, details in sorted(result.items()):
        status = details.get("status", "unknown")
        latency = details.get("latency_ms")
        summary = details.get("summary")
        latency_display = f" {latency:.2f} ms" if isinstance(latency, (int, float)) else ""
        if summary:
            logging.info("%s -> %s%s (%s)", component, status, latency_display, summary)
        else:
            logging.info("%s -> %s%s", component, status, latency_display)


def main() -> int:
    args = parse_args()

    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(message)s",
    )

    interval = max(args.interval, 0)

    while True:
        try:
            result = run_check(args.manage_path, args.python, args.timeout)
        except RuntimeError:
            if args.fail_fast:
                return 1
        else:
            log_summary(result)
            unhealthy = [
                name
                for name, details in result.items()
                if details.get("status") not in {"healthy", "skipped"}
            ]
            if unhealthy and args.fail_fast:
                logging.error("Unhealthy dependencies detected: %s", ", ".join(unhealthy))
                return 2

        if interval == 0:
            break

        time.sleep(interval)

    return 0


if __name__ == "__main__":
    sys.exit(main())
