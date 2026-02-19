import random
import re
from typing import List, Tuple

DICE_REGEX = re.compile(r"(\d*)d(\d+)([+-]\d+)?")

def parse_dice(expression: str) -> Tuple[int, int, int]:
    match = DICE_REGEX.fullmatch(expression.strip())
    if not match:
        raise ValueError("Invalid dice expression. Use format XdY+Z")
    
    quantity = int(match.group(1)) if match.group(1) else 1
    sides = int(match.group(2))
    modifier = int(match.group(3)) if match.group(3) else 0

    return quantity, sides, modifier

def roll_dice(expression: str):
    quantity, sides, modifier = parse_dice(expression)

    rolls = [random.randint(1, sides) for _ in range(quantity)]
    total = sum(rolls) + modifier

    return rolls, modifier, total