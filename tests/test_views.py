"""Integration tests for StorybookView."""

from django.test import Client


def get_client():
    return Client()


class TestStorybookIndex:
    def test_root_redirects_to_storybook(self):
        response = get_client().get("/")
        assert response.status_code == 302
        assert "/storybook/" in response.url

    def test_storybook_index_loads(self):
        response = get_client().get("/storybook/")
        assert response.status_code == 200

    def test_index_has_components_in_context(self):
        response = get_client().get("/storybook/")
        assert "components" in response.context
        assert len(response.context["components"]) > 0

    def test_index_selects_first_component(self):
        response = get_client().get("/storybook/")
        assert "active_component" in response.context
        assert response.context["active_component"] is not None


class TestStorybookComponent:
    def test_button_loads(self):
        response = get_client().get("/storybook/button/")
        assert response.status_code == 200
        assert response.context["active_component"]["slug"] == "button"

    def test_badge_loads(self):
        response = get_client().get("/storybook/badge/")
        assert response.status_code == 200

    def test_text_field_loads(self):
        response = get_client().get("/storybook/text-field/")
        assert response.status_code == 200

    def test_unknown_component_returns_404(self):
        response = get_client().get("/storybook/nonexistent-component/")
        assert response.status_code == 404

    def test_selects_first_story_by_default(self):
        response = get_client().get("/storybook/button/")
        assert response.context["active_story"] is not None
        assert response.context["active_story"]["slug"] == "default"

    def test_has_react_preview_flag(self):
        response = get_client().get("/storybook/button/")
        assert response.context["has_react_preview"] is True


class TestStorybookStory:
    def test_story_loads(self):
        response = get_client().get("/storybook/button/default/")
        assert response.status_code == 200

    def test_story_context_correct(self):
        response = get_client().get("/storybook/button/default/")
        assert response.context["active_story"]["slug"] == "default"
        assert response.context["active_component"]["slug"] == "button"

    def test_unknown_story_returns_404(self):
        response = get_client().get("/storybook/button/nonexistent-story/")
        assert response.status_code == 404

    def test_controls_are_hydrated(self):
        response = get_client().get("/storybook/button/default/")
        controls = response.context["story_controls"]
        assert isinstance(controls, list)
        assert len(controls) > 0
        control_names = [c["name"] for c in controls]
        assert "label" in control_names

    def test_defaults_present(self):
        response = get_client().get("/storybook/button/default/")
        defaults = response.context["story_defaults"]
        assert isinstance(defaults, dict)
        assert "label" in defaults


class TestStorybookFoundation:
    def test_colors_loads(self):
        response = get_client().get("/storybook/colors/")
        assert response.status_code == 200
        assert response.context["active_component"]["type"] == "page"

    def test_foundation_has_no_story(self):
        response = get_client().get("/storybook/colors/")
        assert response.context["active_story"] is None

    def test_foundation_story_slug_returns_404(self):
        response = get_client().get("/storybook/colors/some-story/")
        assert response.status_code == 404
