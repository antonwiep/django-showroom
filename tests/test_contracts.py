"""Validate that shipped example components conform to expected contracts."""

import json
from pathlib import Path

from django.conf import settings

COMPONENTS_ROOT = Path(settings.BASE_DIR) / "components" / "cotton" / "ds"
FOUNDATIONS_ROOT = Path(settings.BASE_DIR) / "showroom" / "foundations"


class TestComponentJsonContracts:
    def _component_paths(self):
        return sorted(COMPONENTS_ROOT.glob("*/component.json"))

    def test_all_components_have_component_json(self):
        paths = self._component_paths()
        assert len(paths) >= 3

    def test_required_fields_present(self):
        for path in self._component_paths():
            data = json.loads(path.read_text())
            assert "slug" in data, f"{path}: missing slug"
            assert "label" in data, f"{path}: missing label"
            assert "type" in data, f"{path}: missing type"
            assert "stories" in data, f"{path}: missing stories"
            assert "cotton" in data, f"{path}: missing cotton"
            assert "template" in data["cotton"], f"{path}: cotton missing template"

    def test_slugs_are_unique(self):
        slugs = []
        for path in self._component_paths():
            data = json.loads(path.read_text())
            slugs.append(data["slug"])
        assert len(slugs) == len(set(slugs)), f"Duplicate slugs: {slugs}"


class TestStoriesJsonContracts:
    def _stories_paths(self):
        return sorted(COMPONENTS_ROOT.glob("*/stories.json"))

    def test_all_components_have_stories(self):
        assert len(self._stories_paths()) >= 3

    def test_stories_are_nonempty_lists(self):
        for path in self._stories_paths():
            data = json.loads(path.read_text())
            assert isinstance(data, list), f"{path}: should be a list"
            assert len(data) > 0, f"{path}: should not be empty"

    def test_each_story_has_required_fields(self):
        for path in self._stories_paths():
            for story in json.loads(path.read_text()):
                assert "slug" in story, f"{path}: story missing slug"
                assert "name" in story, f"{path}: story missing name"
                assert "template" in story, f"{path}: story missing template"

    def test_story_slugs_unique_within_component(self):
        for path in self._stories_paths():
            slugs = [s["slug"] for s in json.loads(path.read_text())]
            assert len(slugs) == len(set(slugs)), f"{path}: duplicate story slugs"


class TestControlsJsonContracts:
    def _controls_paths(self):
        return sorted(COMPONENTS_ROOT.glob("*/stories/controls.json"))

    def test_controls_are_dicts(self):
        for path in self._controls_paths():
            data = json.loads(path.read_text())
            assert isinstance(data, dict), f"{path}: should be a dict"

    def test_each_control_has_name_and_type(self):
        for path in self._controls_paths():
            for key, control in json.loads(path.read_text()).items():
                assert "name" in control, f"{path}[{key}]: missing name"
                assert "type" in control, f"{path}[{key}]: missing type"


class TestFoundationContracts:
    def _foundation_paths(self):
        return sorted(FOUNDATIONS_ROOT.glob("*/foundation.json"))

    def test_foundations_exist(self):
        assert len(self._foundation_paths()) >= 3

    def test_required_fields_present(self):
        for path in self._foundation_paths():
            data = json.loads(path.read_text())
            assert "slug" in data, f"{path}: missing slug"
            assert "label" in data, f"{path}: missing label"
            assert "template" in data, f"{path}: missing template"

    def test_slugs_are_unique(self):
        slugs = []
        for path in self._foundation_paths():
            slugs.append(json.loads(path.read_text())["slug"])
        assert len(slugs) == len(set(slugs))
