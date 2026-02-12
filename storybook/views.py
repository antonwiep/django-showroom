from django.http import Http404
from django.views.generic import TemplateView

from .catalog import (
    COMPONENTS,
    get_color_token_groups,
    get_component,
    get_design_icons,
    get_story,
    get_text_tokens,
    hydrate_controls,
)


class StorybookView(TemplateView):
    template_name = "storybook/index.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        default_component_slug = COMPONENTS[0]["slug"] if COMPONENTS else None
        component_slug = kwargs.get("component") or default_component_slug
        component = get_component(component_slug)
        if component is None:
            raise Http404("Component not found")

        requested_story_slug = kwargs.get("story")
        stories = component.get("stories", [])
        if stories:
            if requested_story_slug:
                active_story = get_story(component, requested_story_slug)
                if active_story is None:
                    raise Http404("Story not found")
            else:
                active_story = stories[0]
        else:
            if requested_story_slug:
                raise Http404("Story not found")
            active_story = None

        story_controls = hydrate_controls(active_story, component) if active_story else []
        active_template = (
            active_story["template"] if active_story else component.get("template")
        )

        context.update(
            {
                "components": COMPONENTS,
                "active_component": component,
                "active_story": active_story,
                "active_template": active_template,
                "has_react_preview": bool(component.get("has_react")),
                "story_controls": story_controls,
                "story_defaults": active_story.get("defaults", {}) if active_story else {},
                "show_controls": bool(active_story and story_controls),
                "color_token_groups": get_color_token_groups(),
                "text_tokens": get_text_tokens(),
                "design_icons": get_design_icons(),
            }
        )
        return context
