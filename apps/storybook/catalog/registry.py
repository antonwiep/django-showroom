from .components import COMPONENTS


def get_component(slug: str):
    for component in COMPONENTS:
        if component["slug"] == slug:
            return component
    return None


def get_story(component, slug: str):
    for story in component["stories"]:
        if story["slug"] == slug:
            return story
    return None


def hydrate_controls(story, component=None):
    component_controls = component.get("controls", {}) if component else {}

    controls = []
    for control_key in story.get("controls", []):
        schema = component_controls.get(control_key)
        if schema:
            controls.append(schema)
    return controls
