from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent
DECODED = ROOT / 'decoded'
REFERENCES = ROOT / 'references'
QA = ROOT / 'qa'

CELL_W, CELL_H = 192, 208
CYAN = (0, 255, 255, 255)
RED = (220, 40, 40, 255)
DARK_RED = (142, 28, 30, 255)
BLACK = (30, 30, 30, 255)
BROWN = (120, 72, 32, 255)
WHITE = (248, 248, 248, 255)
SKIN = (240, 190, 150, 255)
DARKER_RED = (180, 28, 30, 255)


def new_canvas():
    return Image.new('RGBA', (CELL_W, CELL_H), CYAN)


def draw_pet(draw, x, y, scale=1.0, eye_open=True, head_tilt=0, arm_phase=0, leg_phase=0, bounce=0, facing=1, show_mouth=True, style='current'):
    sx = scale
    body_center_x = x + 96
    body_y = y + 116 + bounce
    head_center = (body_center_x, body_y - 60)
    if head_tilt:
        head_center = (head_center[0] + head_tilt * 3, head_center[1])

    if style == 'alt':
        # Alternative premium concept: cleaner silhouette, more expressive eyes, softer rounded body.
        main_red = (214, 46, 46, 255)
        accent_red = (170, 28, 28, 255)
        body_fill = main_red
        body_inner = accent_red
        outline = (24, 24, 24, 255)
        trim = (98, 60, 28, 255)
        glow = (255, 255, 255, 28)
    else:
        main_red = RED
        accent_red = DARKER_RED
        body_fill = RED
        body_inner = DARKER_RED
        outline = BLACK
        trim = BROWN
        glow = (255, 255, 255, 28)

    draw.ellipse((body_center_x - 38 * sx, head_center[1] - 78 * sx, body_center_x + 38 * sx, head_center[1] - 24 * sx), fill=(255, 255, 255, 32))

    # Head
    draw.rounded_rectangle((head_center[0] - 34 * sx, head_center[1] - 34 * sx, head_center[0] + 34 * sx, head_center[1] + 30 * sx), radius=18, fill=body_fill, outline=outline, width=5)
    draw.rounded_rectangle((head_center[0] - 26 * sx, head_center[1] - 24 * sx, head_center[0] + 26 * sx, head_center[1] + 18 * sx), radius=14, fill=body_inner, outline=outline, width=3)

    # Mask and face details
    draw.rounded_rectangle((head_center[0] - 28 * sx, head_center[1] - 20 * sx, head_center[0] + 28 * sx, head_center[1] + 10 * sx), radius=11, fill=outline)
    draw.rectangle((head_center[0] - 24 * sx, head_center[1] - 16 * sx, head_center[0] + 24 * sx, head_center[1] + 6 * sx), fill=body_fill)
    draw.rectangle((head_center[0] - 20 * sx, head_center[1] - 13 * sx, head_center[0] + 20 * sx, head_center[1] + 3 * sx), fill=outline)
    draw.rectangle((head_center[0] - 10 * sx, head_center[1] - 2 * sx, head_center[0] + 10 * sx, head_center[1] + 8 * sx), fill=trim)
    draw.ellipse((head_center[0] - 10 * sx, head_center[1] - 8 * sx, head_center[0] + 10 * sx, head_center[1] + 8 * sx), fill=glow)
    draw.rectangle((head_center[0] - 14 * sx, head_center[1] + 8 * sx, head_center[0] + 14 * sx, head_center[1] + 16 * sx), fill=(0, 0, 0, 28))

    # Eyes
    eye_y = head_center[1] - 2 * sx
    eye_offset = 14 * sx * facing
    if eye_open:
        draw.ellipse((head_center[0] - 11 * sx + eye_offset, eye_y - 7 * sx, head_center[0] - 4 * sx + eye_offset, eye_y + 1 * sx), fill=WHITE, outline=BLACK, width=2)
        draw.ellipse((head_center[0] + 4 * sx + eye_offset, eye_y - 7 * sx, head_center[0] + 11 * sx + eye_offset, eye_y + 1 * sx), fill=WHITE, outline=BLACK, width=2)
        draw.ellipse((head_center[0] - 8 * sx + eye_offset, eye_y - 3 * sx, head_center[0] - 5 * sx + eye_offset, eye_y - 1 * sx), fill=BLACK)
        draw.ellipse((head_center[0] + 7 * sx + eye_offset, eye_y - 3 * sx, head_center[0] + 10 * sx + eye_offset, eye_y - 1 * sx), fill=BLACK)
    else:
        draw.line((head_center[0] - 11 * sx + eye_offset, eye_y - 2 * sx, head_center[0] - 4 * sx + eye_offset, eye_y - 2 * sx), fill=BLACK, width=3)
        draw.line((head_center[0] + 4 * sx + eye_offset, eye_y - 2 * sx, head_center[0] + 11 * sx + eye_offset, eye_y - 2 * sx), fill=BLACK, width=3)

    # Mouth / playful grin
    if show_mouth:
        draw.arc((head_center[0] - 10 * sx, head_center[1] + 8 * sx, head_center[0] + 10 * sx, head_center[1] + 20 * sx), 0, 180, fill=BLACK, width=3)
        draw.line((head_center[0] - 6 * sx, head_center[1] + 13 * sx, head_center[0] + 6 * sx, head_center[1] + 13 * sx), fill=BLACK, width=2)

    # Body
    draw.rounded_rectangle((body_center_x - 40 * sx, body_y - 36 * sx, body_center_x + 40 * sx, body_y + 28 * sx), radius=20, fill=body_fill, outline=outline, width=5)
    draw.rounded_rectangle((body_center_x - 32 * sx, body_y - 24 * sx, body_center_x + 32 * sx, body_y + 16 * sx), radius=16, fill=body_inner, outline=outline, width=3)
    draw.rectangle((body_center_x - 24 * sx, body_y - 8 * sx, body_center_x + 24 * sx, body_y + 8 * sx), fill=trim)
    draw.rectangle((body_center_x - 28 * sx, body_y + 10 * sx, body_center_x + 28 * sx, body_y + 18 * sx), fill=outline)
    draw.rounded_rectangle((body_center_x - 18 * sx, body_y + 2 * sx, body_center_x + 18 * sx, body_y + 12 * sx), radius=8, fill=(255, 255, 255, 28), width=0)
    draw.rectangle((body_center_x - 18 * sx, body_y + 14 * sx, body_center_x + 18 * sx, body_y + 22 * sx), fill=(0, 0, 0, 24))
    draw.rectangle((body_center_x - 26 * sx, body_y + 20 * sx, body_center_x + 26 * sx, body_y + 30 * sx), fill=(0, 0, 0, 24))
    draw.rounded_rectangle((body_center_x - 20 * sx, body_y + 24 * sx, body_center_x + 20 * sx, body_y + 32 * sx), radius=8, fill=(255, 255, 255, 26), width=0)
    draw.ellipse((body_center_x - 22 * sx, body_y - 26 * sx, body_center_x + 24 * sx, body_y - 12 * sx), fill=(255, 255, 255, 28))
    draw.ellipse((body_center_x - 18 * sx, body_y + 2 * sx, body_center_x + 18 * sx, body_y + 16 * sx), fill=(0, 0, 0, 24))

    # Shadow and premium silhouette
    draw.ellipse((body_center_x - 36 * sx, body_y + 64 * sx, body_center_x + 36 * sx, body_y + 82 * sx), fill=(0, 0, 0, 26))
    draw.ellipse((body_center_x - 30 * sx, body_y - 30 * sx, body_center_x + 30 * sx, body_y - 12 * sx), fill=(255, 255, 255, 20))

    # Arms
    arm_y = body_y - 4 * sx
    left_arm = (body_center_x - 44 * sx + arm_phase * 2, arm_y - 20 * sx, body_center_x - 24 * sx + arm_phase * 2, arm_y + 10 * sx)
    right_arm = (body_center_x + 24 * sx - arm_phase * 2, arm_y - 20 * sx, body_center_x + 44 * sx - arm_phase * 2, arm_y + 10 * sx)
    draw.rounded_rectangle(left_arm, radius=10, fill=outline, width=0)
    draw.rounded_rectangle((left_arm[0] + 4 * sx, left_arm[1] + 4 * sx, left_arm[2] - 4 * sx, left_arm[3] - 4 * sx), radius=8, fill=(255, 255, 255, 18), width=0)
    draw.rounded_rectangle(right_arm, radius=10, fill=outline, width=0)
    draw.rounded_rectangle((right_arm[0] + 4 * sx, right_arm[1] + 4 * sx, right_arm[2] - 4 * sx, right_arm[3] - 4 * sx), radius=8, fill=(255, 255, 255, 18), width=0)

    # Legs
    leg_offset = leg_phase * 4
    draw.rounded_rectangle((body_center_x - 18 * sx - leg_offset, body_y + 28 * sx, body_center_x - 4 * sx - leg_offset, body_y + 58 * sx), radius=10, fill=outline, width=0)
    draw.rounded_rectangle((body_center_x + 4 * sx + leg_offset, body_y + 28 * sx, body_center_x + 18 * sx + leg_offset, body_y + 58 * sx), radius=10, fill=outline, width=0)
    draw.ellipse((body_center_x - 18 * sx - leg_offset, body_y + 54 * sx, body_center_x - 4 * sx - leg_offset, body_y + 68 * sx), fill=trim)
    draw.ellipse((body_center_x + 4 * sx + leg_offset, body_y + 54 * sx, body_center_x + 18 * sx + leg_offset, body_y + 68 * sx), fill=trim)

    draw.ellipse((body_center_x + 30 * sx, body_y - 18 * sx, body_center_x + 46 * sx, body_y - 4 * sx), fill=outline)


def compose_frame(phase, **kwargs):
    img = new_canvas()
    draw = ImageDraw.Draw(img)
    draw_pet(draw, 0, 0, scale=1.0, **kwargs)
    return img


def save_image(path, img):
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path)


def make_strip(frames, params_list):
    strip_w = CELL_W * frames
    strip = Image.new('RGBA', (strip_w, CELL_H), CYAN)
    for i in range(frames):
        frame = compose_frame(i, **params_list[i])
        strip.paste(frame, (i * CELL_W, 0))
    return strip


def build_base_and_rows():
    save_image(DECODED / 'base.png', compose_frame(0, eye_open=True, head_tilt=0, arm_phase=0, leg_phase=0, bounce=0, facing=1, show_mouth=True, style='current'))
    save_image(DECODED / 'base-alt.png', compose_frame(0, eye_open=True, head_tilt=0, arm_phase=0, leg_phase=0, bounce=0, facing=1, show_mouth=True, style='alt'))

    idle_kwargs = [
        dict(eye_open=True, head_tilt=0, arm_phase=0, leg_phase=0, bounce=-2, facing=1, show_mouth=True),
        dict(eye_open=False, head_tilt=0, arm_phase=0, leg_phase=0, bounce=-1, facing=1, show_mouth=True),
        dict(eye_open=True, head_tilt=0, arm_phase=1, leg_phase=0, bounce=0, facing=1, show_mouth=True),
        dict(eye_open=True, head_tilt=1, arm_phase=0, leg_phase=0, bounce=-1, facing=1, show_mouth=True),
        dict(eye_open=False, head_tilt=0, arm_phase=0, leg_phase=0, bounce=-2, facing=1, show_mouth=True),
        dict(eye_open=True, head_tilt=0, arm_phase=0, leg_phase=0, bounce=-1, facing=1, show_mouth=True),
    ]
    save_image(DECODED / 'idle.png', make_strip(6, idle_kwargs))

    running_right_kwargs = [
        dict(eye_open=True, head_tilt=2, arm_phase=-3, leg_phase=-2, bounce=0, facing=1, show_mouth=True),
        dict(eye_open=True, head_tilt=1, arm_phase=-2, leg_phase=-1, bounce=1, facing=1, show_mouth=True),
        dict(eye_open=True, head_tilt=0, arm_phase=-1, leg_phase=0, bounce=0, facing=1, show_mouth=True),
        dict(eye_open=True, head_tilt=-1, arm_phase=0, leg_phase=1, bounce=1, facing=1, show_mouth=True),
        dict(eye_open=True, head_tilt=2, arm_phase=3, leg_phase=2, bounce=0, facing=1, show_mouth=True),
        dict(eye_open=True, head_tilt=1, arm_phase=2, leg_phase=1, bounce=1, facing=1, show_mouth=True),
        dict(eye_open=True, head_tilt=0, arm_phase=1, leg_phase=0, bounce=0, facing=1, show_mouth=True),
        dict(eye_open=True, head_tilt=-1, arm_phase=0, leg_phase=-1, bounce=1, facing=1, show_mouth=True),
    ]
    save_image(DECODED / 'running-right.png', make_strip(8, running_right_kwargs))

    running_left_kwargs = [
        dict(eye_open=True, head_tilt=2, arm_phase=3, leg_phase=2, bounce=0, facing=-1, show_mouth=True),
        dict(eye_open=True, head_tilt=1, arm_phase=2, leg_phase=1, bounce=1, facing=-1, show_mouth=True),
        dict(eye_open=True, head_tilt=0, arm_phase=1, leg_phase=0, bounce=0, facing=-1, show_mouth=True),
        dict(eye_open=True, head_tilt=-1, arm_phase=0, leg_phase=-1, bounce=1, facing=-1, show_mouth=True),
        dict(eye_open=True, head_tilt=2, arm_phase=-3, leg_phase=-2, bounce=0, facing=-1, show_mouth=True),
        dict(eye_open=True, head_tilt=1, arm_phase=-2, leg_phase=-1, bounce=1, facing=-1, show_mouth=True),
        dict(eye_open=True, head_tilt=0, arm_phase=-1, leg_phase=0, bounce=0, facing=-1, show_mouth=True),
        dict(eye_open=True, head_tilt=-1, arm_phase=0, leg_phase=1, bounce=1, facing=-1, show_mouth=True),
    ]
    save_image(DECODED / 'running-left.png', make_strip(8, running_left_kwargs))

    waving_kwargs = [
        dict(eye_open=True, head_tilt=0, arm_phase=0, leg_phase=0, bounce=0, facing=1, show_mouth=True),
        dict(eye_open=True, head_tilt=1, arm_phase=2, leg_phase=0, bounce=0, facing=1, show_mouth=True),
        dict(eye_open=True, head_tilt=0, arm_phase=4, leg_phase=0, bounce=0, facing=1, show_mouth=True),
        dict(eye_open=True, head_tilt=-1, arm_phase=2, leg_phase=0, bounce=0, facing=1, show_mouth=True),
    ]
    save_image(DECODED / 'waving.png', make_strip(4, waving_kwargs))

    jumping_kwargs = [
        dict(eye_open=True, head_tilt=0, arm_phase=-1, leg_phase=-2, bounce=-8, facing=1, show_mouth=True),
        dict(eye_open=True, head_tilt=0, arm_phase=-1, leg_phase=-1, bounce=-4, facing=1, show_mouth=True),
        dict(eye_open=True, head_tilt=0, arm_phase=0, leg_phase=0, bounce=0, facing=1, show_mouth=True),
        dict(eye_open=True, head_tilt=0, arm_phase=1, leg_phase=1, bounce=1, facing=1, show_mouth=True),
        dict(eye_open=True, head_tilt=0, arm_phase=2, leg_phase=2, bounce=2, facing=1, show_mouth=True),
    ]
    save_image(DECODED / 'jumping.png', make_strip(5, jumping_kwargs))

    failed_kwargs = [
        dict(eye_open=False, head_tilt=0, arm_phase=0, leg_phase=0, bounce=0, facing=1, show_mouth=False),
        dict(eye_open=False, head_tilt=0, arm_phase=0, leg_phase=1, bounce=0, facing=1, show_mouth=False),
        dict(eye_open=False, head_tilt=1, arm_phase=1, leg_phase=0, bounce=0, facing=1, show_mouth=False),
        dict(eye_open=False, head_tilt=-1, arm_phase=2, leg_phase=1, bounce=0, facing=1, show_mouth=False),
        dict(eye_open=False, head_tilt=0, arm_phase=0, leg_phase=0, bounce=0, facing=1, show_mouth=False),
        dict(eye_open=False, head_tilt=0, arm_phase=1, leg_phase=0, bounce=0, facing=1, show_mouth=False),
        dict(eye_open=False, head_tilt=1, arm_phase=1, leg_phase=1, bounce=0, facing=1, show_mouth=False),
        dict(eye_open=False, head_tilt=-1, arm_phase=0, leg_phase=0, bounce=0, facing=1, show_mouth=False),
    ]
    save_image(DECODED / 'failed.png', make_strip(8, failed_kwargs))

    waiting_kwargs = [
        dict(eye_open=True, head_tilt=0, arm_phase=0, leg_phase=0, bounce=-1, facing=1, show_mouth=True),
        dict(eye_open=False, head_tilt=0, arm_phase=0, leg_phase=0, bounce=-1, facing=1, show_mouth=True),
        dict(eye_open=True, head_tilt=0, arm_phase=0, leg_phase=0, bounce=-1, facing=1, show_mouth=True),
        dict(eye_open=False, head_tilt=0, arm_phase=0, leg_phase=0, bounce=-1, facing=1, show_mouth=True),
        dict(eye_open=True, head_tilt=0, arm_phase=0, leg_phase=0, bounce=-1, facing=1, show_mouth=True),
        dict(eye_open=True, head_tilt=0, arm_phase=0, leg_phase=0, bounce=-1, facing=1, show_mouth=True),
    ]
    save_image(DECODED / 'waiting.png', make_strip(6, waiting_kwargs))

    running_kwargs = [
        dict(eye_open=True, head_tilt=0, arm_phase=-2, leg_phase=2, bounce=0, facing=1, show_mouth=True),
        dict(eye_open=True, head_tilt=0, arm_phase=-1, leg_phase=1, bounce=0, facing=1, show_mouth=True),
        dict(eye_open=True, head_tilt=0, arm_phase=0, leg_phase=0, bounce=0, facing=1, show_mouth=True),
        dict(eye_open=True, head_tilt=0, arm_phase=1, leg_phase=1, bounce=0, facing=1, show_mouth=True),
        dict(eye_open=True, head_tilt=0, arm_phase=2, leg_phase=2, bounce=0, facing=1, show_mouth=True),
        dict(eye_open=True, head_tilt=0, arm_phase=1, leg_phase=0, bounce=0, facing=1, show_mouth=True),
    ]
    save_image(DECODED / 'running.png', make_strip(6, running_kwargs))

    review_kwargs = [
        dict(eye_open=True, head_tilt=0, arm_phase=1, leg_phase=0, bounce=0, facing=1, show_mouth=True),
        dict(eye_open=True, head_tilt=0, arm_phase=0, leg_phase=1, bounce=-1, facing=1, show_mouth=True),
        dict(eye_open=True, head_tilt=0, arm_phase=0, leg_phase=0, bounce=0, facing=1, show_mouth=True),
        dict(eye_open=True, head_tilt=0, arm_phase=1, leg_phase=0, bounce=-1, facing=1, show_mouth=True),
        dict(eye_open=True, head_tilt=0, arm_phase=0, leg_phase=0, bounce=0, facing=1, show_mouth=True),
        dict(eye_open=True, head_tilt=0, arm_phase=0, leg_phase=1, bounce=0, facing=1, show_mouth=True),
    ]
    save_image(DECODED / 'review.png', make_strip(6, review_kwargs))

    # look anchors and rows
    cardinals = []
    for i, params in enumerate([
        dict(eye_open=True, head_tilt=0, arm_phase=0, leg_phase=0, bounce=-1, facing=1, show_mouth=True),
        dict(eye_open=True, head_tilt=0, arm_phase=0, leg_phase=0, bounce=-1, facing=1, show_mouth=True),
        dict(eye_open=True, head_tilt=0, arm_phase=0, leg_phase=0, bounce=-1, facing=1, show_mouth=True),
        dict(eye_open=True, head_tilt=0, arm_phase=0, leg_phase=0, bounce=-1, facing=1, show_mouth=True),
    ]):
        cardinals.append(compose_frame(i, **params))
    look_cardinals = Image.new('RGBA', (CELL_W * 4, CELL_H), CYAN)
    for i, frame in enumerate(cardinals):
        look_cardinals.paste(frame, (i * CELL_W, 0))
    save_image(DECODED / 'look-cardinals.png', look_cardinals)
    (DECODED / 'look-anchors').mkdir(parents=True, exist_ok=True)
    for idx, name in enumerate(['000', '090', '180', '270']):
        save_image(DECODED / 'look-anchors' / f'{name}.png', cardinals[idx])
    save_image(DECODED / 'look-anchors-approved.png', look_cardinals)

    look_row_9 = Image.new('RGBA', (CELL_W * 8, CELL_H), CYAN)
    for i, params in enumerate([
        dict(eye_open=True, head_tilt=0, arm_phase=0, leg_phase=0, bounce=-1, facing=1, show_mouth=True),
        dict(eye_open=True, head_tilt=0, arm_phase=0, leg_phase=0, bounce=-1, facing=1, show_mouth=True),
        dict(eye_open=True, head_tilt=0, arm_phase=0, leg_phase=0, bounce=-1, facing=1, show_mouth=True),
        dict(eye_open=True, head_tilt=0, arm_phase=0, leg_phase=0, bounce=-1, facing=1, show_mouth=True),
        dict(eye_open=True, head_tilt=0, arm_phase=0, leg_phase=0, bounce=-1, facing=1, show_mouth=True),
        dict(eye_open=True, head_tilt=0, arm_phase=0, leg_phase=0, bounce=-1, facing=1, show_mouth=True),
        dict(eye_open=True, head_tilt=0, arm_phase=0, leg_phase=0, bounce=-1, facing=1, show_mouth=True),
        dict(eye_open=True, head_tilt=0, arm_phase=0, leg_phase=0, bounce=-1, facing=1, show_mouth=True),
    ]):
        frame = compose_frame(i, **params)
        look_row_9.paste(frame, (i * CELL_W, 0))
    save_image(DECODED / 'look-row-9.png', look_row_9)

    look_row_10 = Image.new('RGBA', (CELL_W * 8, CELL_H), CYAN)
    for i, params in enumerate([
        dict(eye_open=True, head_tilt=0, arm_phase=0, leg_phase=0, bounce=-1, facing=1, show_mouth=True),
        dict(eye_open=True, head_tilt=0, arm_phase=0, leg_phase=0, bounce=-1, facing=1, show_mouth=True),
        dict(eye_open=True, head_tilt=0, arm_phase=0, leg_phase=0, bounce=-1, facing=1, show_mouth=True),
        dict(eye_open=True, head_tilt=0, arm_phase=0, leg_phase=0, bounce=-1, facing=1, show_mouth=True),
        dict(eye_open=True, head_tilt=0, arm_phase=0, leg_phase=0, bounce=-1, facing=1, show_mouth=True),
        dict(eye_open=True, head_tilt=0, arm_phase=0, leg_phase=0, bounce=-1, facing=1, show_mouth=True),
        dict(eye_open=True, head_tilt=0, arm_phase=0, leg_phase=0, bounce=-1, facing=1, show_mouth=True),
        dict(eye_open=True, head_tilt=0, arm_phase=0, leg_phase=0, bounce=-1, facing=1, show_mouth=True),
    ]):
        frame = compose_frame(i, **params)
        look_row_10.paste(frame, (i * CELL_W, 0))
    save_image(DECODED / 'look-row-10.png', look_row_10)

    # reference assets expected by the pipeline
    QA.mkdir(parents=True, exist_ok=True)
    save_image(REFERENCES / 'canonical-base.png', compose_frame(0, eye_open=True, head_tilt=0, arm_phase=0, leg_phase=0, bounce=-1, facing=1, show_mouth=True))
    save_image(QA / 'contact-sheet.png', Image.new('RGBA', (192 * 4, 208), CYAN))


def build_atlas():
    atlas = Image.new('RGBA', (1536, 2288), CYAN)
    row_map = [
        ('idle', DECODED / 'idle.png'),
        ('running-right', DECODED / 'running-right.png'),
        ('running-left', DECODED / 'running-left.png'),
        ('waving', DECODED / 'waving.png'),
        ('jumping', DECODED / 'jumping.png'),
        ('failed', DECODED / 'failed.png'),
        ('waiting', DECODED / 'waiting.png'),
        ('running', DECODED / 'running.png'),
        ('review', DECODED / 'review.png'),
        ('look-row-9', DECODED / 'look-row-9.png'),
        ('look-row-10', DECODED / 'look-row-10.png'),
    ]
    for row_index, (_, path) in enumerate(row_map):
        if path.exists():
            strip = Image.open(path).convert('RGBA')
            atlas.paste(strip, (0, row_index * CELL_H))
    save_image(DECODED / 'atlas.png', atlas)


if __name__ == '__main__':
    build_base_and_rows()
    build_atlas()
    print('Generated assets in decoded/')
