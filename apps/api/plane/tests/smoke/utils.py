"""Utility helpers for smoke tests covering end-to-end API flows."""

from __future__ import annotations

import json
import uuid
from dataclasses import dataclass
from datetime import timedelta
from typing import Any, Dict, List

from django.core.files.uploadedfile import SimpleUploadedFile
from django.utils import timezone
from rest_framework import status


@dataclass(frozen=True)
class ProjectContext:
    """Information required across smoke tests for a single project."""

    workspace_slug: str
    project_id: str


def _assert_status(response, expected_status: int, message: str) -> None:
    """Raise an assertion error with a helpful payload when the status is unexpected."""

    if response.status_code != expected_status:
        try:
            details = response.json()
        except Exception:  # pragma: no cover - fallback for non-JSON bodies
            details = response.content
        raise AssertionError(f"{message}: {response.status_code} -> {details}")


def create_project(session_client, workspace_slug: str) -> Dict[str, Any]:
    """Create a project through the public API and return its payload."""

    identifier = f"SMK{uuid.uuid4().hex[:5].upper()}"
    payload = {"name": f"Smoke Project {identifier}", "identifier": identifier}
    url = f"/api/v1/workspaces/{workspace_slug}/projects/"
    response = session_client.post(url, payload, format="json")
    _assert_status(response, status.HTTP_201_CREATED, "Unable to create project")
    return response.json()


def list_project_states(session_client, context: ProjectContext) -> List[Dict[str, Any]]:
    """Return the states configured for a project."""

    url = (
        f"/api/v1/workspaces/{context.workspace_slug}/projects/{context.project_id}/states/"
    )
    response = session_client.get(url)
    _assert_status(response, status.HTTP_200_OK, "Unable to fetch project states")
    data = response.json()
    return data.get("results", data)


def get_default_state_id(states: List[Dict[str, Any]]) -> str:
    """Return the identifier for the default state within a list of states."""

    if not states:
        raise AssertionError("Projects created for smoke tests must have states available")

    for state in states:
        if state.get("default"):
            return state["id"]
    return states[0]["id"]


def create_issue(
    session_client,
    context: ProjectContext,
    *,
    state_id: str | None = None,
    title: str | None = None,
) -> Dict[str, Any]:
    """Create an issue for the supplied project and return its payload."""

    payload: Dict[str, Any] = {
        "name": title or f"Smoke Issue {uuid.uuid4().hex[:6]}",
        "priority": "high",
        "description_html": "<p>Smoke test issue</p>",
    }
    if state_id:
        payload["state"] = state_id

    url = (
        f"/api/v1/workspaces/{context.workspace_slug}/projects/{context.project_id}/issues/"
    )
    response = session_client.post(url, payload, format="json")
    _assert_status(response, status.HTTP_201_CREATED, "Unable to create issue")
    return response.json()


def create_cycle(
    session_client,
    context: ProjectContext,
    *,
    name: str | None = None,
    duration_days: int = 7,
) -> Dict[str, Any]:
    """Create a cycle for the supplied project and return its payload."""

    start_at = timezone.now()
    end_at = start_at + timedelta(days=duration_days)
    payload = {
        "name": name or f"Smoke Cycle {uuid.uuid4().hex[:6]}",
        "start_date": start_at.isoformat(),
        "end_date": end_at.isoformat(),
    }

    url = (
        f"/api/v1/workspaces/{context.workspace_slug}/projects/{context.project_id}/cycles/"
    )
    response = session_client.post(url, payload, format="json")
    _assert_status(response, status.HTTP_201_CREATED, "Unable to create cycle")
    return response.json()


def upload_issue_attachment(
    session_client,
    context: ProjectContext,
    *,
    issue_id: str,
    file_name: str = "smoke-attachment.txt",
    content: bytes | None = None,
) -> Dict[str, Any]:
    """Upload an attachment for an issue and return the resulting payload."""

    upload = SimpleUploadedFile(
        file_name,
        content or b"Smoke attachment for verification",
        content_type="text/plain",
    )
    payload = {
        "attributes": json.dumps({"name": file_name, "type": "text/plain"}),
        "asset": upload,
    }

    url = (
        f"/api/workspaces/{context.workspace_slug}/projects/{context.project_id}/"
        f"issues/{issue_id}/issue-attachments/"
    )
    response = session_client.post(url, payload, format="multipart")
    _assert_status(response, status.HTTP_201_CREATED, "Unable to upload attachment")
    return response.json()


def fetch_issue_list(session_client, context: ProjectContext) -> Dict[str, Any]:
    """Fetch the issue list response for validation helpers."""

    url = (
        f"/api/v1/workspaces/{context.workspace_slug}/projects/{context.project_id}/issues/"
    )
    response = session_client.get(url)
    _assert_status(response, status.HTTP_200_OK, "Unable to list issues")
    return response.json()


def fetch_issue_detail(
    session_client, context: ProjectContext, issue_id: str
) -> Dict[str, Any]:
    """Fetch details for a single issue."""

    url = (
        f"/api/v1/workspaces/{context.workspace_slug}/projects/{context.project_id}/"
        f"issues/{issue_id}/"
    )
    response = session_client.get(url)
    _assert_status(response, status.HTTP_200_OK, "Unable to fetch issue detail")
    return response.json()


def list_issue_attachments(
    session_client, context: ProjectContext, issue_id: str
) -> List[Dict[str, Any]]:
    """Return the attachments stored against an issue."""

    url = (
        f"/api/workspaces/{context.workspace_slug}/projects/{context.project_id}/"
        f"issues/{issue_id}/issue-attachments/"
    )
    response = session_client.get(url)
    _assert_status(response, status.HTTP_200_OK, "Unable to list attachments")
    data = response.json()
    return data if isinstance(data, list) else data.get("results", [])


def fetch_workspace_default_analytics(session_client, workspace_slug: str) -> Dict[str, Any]:
    """Retrieve the default analytics payload for a workspace."""

    url = f"/api/workspaces/{workspace_slug}/default-analytics/"
    response = session_client.get(url)
    _assert_status(response, status.HTTP_200_OK, "Unable to load workspace analytics")
    return response.json()


def fetch_project_analytics(session_client, context: ProjectContext) -> Dict[str, Any]:
    """Retrieve analytics for a specific project."""

    url = (
        f"/api/workspaces/{context.workspace_slug}/projects/{context.project_id}/"
        "advance-analytics/"
    )
    response = session_client.get(url)
    _assert_status(response, status.HTTP_200_OK, "Unable to load project analytics")
    return response.json()

