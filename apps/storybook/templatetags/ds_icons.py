from django import template
from django.utils.safestring import mark_safe

from apps.storybook.design_icons import render_design_icon

register = template.Library()


@register.simple_tag
def ds_icon(icon_name, css_class=""):
    return mark_safe(render_design_icon(icon_name, css_class))
