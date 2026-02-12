"""Tests for storybook.catalog.registry."""

from storybook.catalog.registry import get_component, get_story, hydrate_controls


class TestGetStory:
    def test_finds_existing_story(self, sample_component):
        result = get_story(sample_component, "default")
        assert result is not None
        assert result["slug"] == "default"

    def test_returns_none_for_missing_story(self, sample_component):
        assert get_story(sample_component, "nonexistent") is None

    def test_finds_second_story(self, sample_component):
        result = get_story(sample_component, "secondary")
        assert result is not None
        assert result["slug"] == "secondary"


class TestHydrateControls:
    def test_hydrates_matching_controls(self, sample_component, sample_story):
        result = hydrate_controls(sample_story, sample_component)
        assert len(result) == 2
        assert result[0]["name"] == "label"
        assert result[1]["name"] == "variant"

    def test_skips_missing_control_keys(self, sample_component):
        story = {"controls": ["label", "nonexistent_control"]}
        result = hydrate_controls(story, sample_component)
        assert len(result) == 1
        assert result[0]["name"] == "label"

    def test_empty_controls_list(self, sample_component):
        result = hydrate_controls({"controls": []}, sample_component)
        assert result == []

    def test_no_controls_key_in_story(self, sample_component):
        result = hydrate_controls({}, sample_component)
        assert result == []

    def test_no_component_controls(self):
        result = hydrate_controls({"controls": ["label"]}, {"controls": {}})
        assert result == []

    def test_none_component(self):
        result = hydrate_controls({"controls": ["label"]}, component=None)
        assert result == []


class TestGetComponentIntegration:
    """Tests using the real component data loaded from disk."""

    def test_finds_button(self):
        result = get_component("button")
        assert result is not None
        assert result["slug"] == "button"

    def test_finds_badge(self):
        result = get_component("badge")
        assert result is not None
        assert result["slug"] == "badge"

    def test_finds_text_field(self):
        result = get_component("text-field")
        assert result is not None
        assert result["slug"] == "text-field"

    def test_returns_none_for_unknown(self):
        assert get_component("nonexistent-component") is None

    def test_finds_foundation_colors(self):
        result = get_component("colors")
        assert result is not None
        assert result["type"] == "page"
