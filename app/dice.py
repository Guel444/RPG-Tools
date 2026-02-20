import random
import re
from typing import Tuple

DICE_REGEX = re.compile(r"(\d*)d(\d+)([+-]\d+)?")

MAX_QUANTITY = 100  # máximo de dados por rolagem
MAX_SIDES = 1000    # máximo de lados por dado

def parse_dice(expression: str) -> Tuple[int, int, int]:
    match = DICE_REGEX.fullmatch(expression.strip().lower())
    if not match:
        raise ValueError("Expressão inválida. Use o formato XdY+Z (ex: 2d20+5)")

    quantity = int(match.group(1)) if match.group(1) else 1
    sides = int(match.group(2))
    modifier = int(match.group(3)) if match.group(3) else 0

    if quantity < 1:
        raise ValueError("A quantidade de dados deve ser pelo menos 1")
    if quantity > MAX_QUANTITY:
        raise ValueError(f"Quantidade máxima de dados é {MAX_QUANTITY}")
    if sides < 2:
        raise ValueError("O dado deve ter pelo menos 2 lados")
    if sides > MAX_SIDES:
        raise ValueError(f"Número máximo de lados é {MAX_SIDES}")

    return quantity, sides, modifier

def roll_dice(expression: str):
    quantity, sides, modifier = parse_dice(expression)
    rolls = [random.randint(1, sides) for _ in range(quantity)]
    total = sum(rolls) + modifier
    return rolls, modifier, total