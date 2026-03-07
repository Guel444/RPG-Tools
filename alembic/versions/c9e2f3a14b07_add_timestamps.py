"""add updated_at to campaigns and created_at to npcs

Revision ID: c9e2f3a14b07
Revises: b7d4e1f02c85
Create Date: 2026-03-01 00:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


revision: str = 'c9e2f3a14b07'
down_revision: Union[str, Sequence[str], None] = 'b7d4e1f02c85'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.batch_alter_table('campaigns') as batch_op:
        batch_op.add_column(sa.Column(
            'updated_at',
            sa.DateTime(timezone=True),
            server_default=sa.text('CURRENT_TIMESTAMP'),
            nullable=True
        ))

    with op.batch_alter_table('npcs') as batch_op:
        batch_op.add_column(sa.Column(
            'created_at',
            sa.DateTime(timezone=True),
            server_default=sa.text('CURRENT_TIMESTAMP'),
            nullable=True
        ))


def downgrade() -> None:
    with op.batch_alter_table('campaigns') as batch_op:
        batch_op.drop_column('updated_at')

    with op.batch_alter_table('npcs') as batch_op:
        batch_op.drop_column('created_at')