import pytest
from rest_framework import status

from .utils import (
    ProjectContext,
    create_cycle,
    create_issue,
    create_project,
    fetch_issue_detail,
    fetch_issue_list,
    fetch_project_analytics,
    fetch_workspace_default_analytics,
    get_default_state_id,
    list_issue_attachments,
    list_project_states,
    upload_issue_attachment,
)


@pytest.fixture
def project_context(session_client, workspace):
    project = create_project(session_client, workspace.slug)
    return ProjectContext(workspace_slug=workspace.slug, project_id=project["id"])


@pytest.fixture
def issue_context(session_client, project_context):
    states = list_project_states(session_client, project_context)
    default_state_id = get_default_state_id(states)
    issue = create_issue(
        session_client, project_context, state_id=default_state_id, title="Smoke Issue"
    )
    return {"issue": issue, "state_id": default_state_id, "project_context": project_context}


@pytest.mark.smoke
class TestIssueSmokeFlows:
    @pytest.mark.django_db
    def test_issue_creation_and_retrieval(self, session_client, issue_context):
        project_context = issue_context["project_context"]
        issue = issue_context["issue"]

        list_response = fetch_issue_list(session_client, project_context)
        list_results = (
            list_response.get("results", [])
            if isinstance(list_response, dict)
            else list_response
        )
        issue_ids = {item["id"] for item in list_results}
        assert issue["id"] in issue_ids, "Newly created issue should appear in listings"

        detail = fetch_issue_detail(session_client, project_context, issue["id"])
        assert detail["id"] == issue["id"]
        assert detail["name"] == issue["name"]


@pytest.mark.smoke
class TestCycleSmokeFlows:
    @pytest.mark.django_db
    def test_cycle_creation_and_listing(self, session_client, project_context):
        cycle = create_cycle(session_client, project_context)

        url = (
            f"/api/v1/workspaces/{project_context.workspace_slug}/"
            f"projects/{project_context.project_id}/cycles/"
        )
        response = session_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        cycles = data.get("results", data if isinstance(data, list) else [])
        cycle_ids = {item.get("id") for item in cycles}
        assert cycle["id"] in cycle_ids, "Created cycle should be listed for the project"


@pytest.mark.smoke
class TestIssueAttachmentSmokeFlows:
    @pytest.mark.django_db
    def test_issue_file_upload(self, session_client, issue_context):
        project_context = issue_context["project_context"]
        issue = issue_context["issue"]

        attachment = upload_issue_attachment(
            session_client, project_context, issue_id=issue["id"]
        )

        assert attachment.get("asset_url"), "Attachment response should include asset URL"

        attachments = list_issue_attachments(session_client, project_context, issue["id"])
        attachment_ids = {item.get("id") for item in attachments}
        assert attachment.get("id") in attachment_ids


@pytest.mark.smoke
class TestAnalyticsSmokeFlows:
    @pytest.mark.django_db
    def test_workspace_and_project_analytics(self, session_client, issue_context):
        project_context = issue_context["project_context"]

        workspace_analytics = fetch_workspace_default_analytics(
            session_client, project_context.workspace_slug
        )
        assert "total_issues" in workspace_analytics

        project_analytics = fetch_project_analytics(session_client, project_context)
        assert "total_work_items" in project_analytics

