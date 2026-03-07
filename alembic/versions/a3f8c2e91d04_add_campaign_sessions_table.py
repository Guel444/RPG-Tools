"""add campaign_sessions table

Revision ID: a3f8c2e91d04
Revises: f161f87d9ac8
Create Date: 2026-03-01 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a3f8c2e91d04'
down_revision: Union[str, Sequence[str], None] = 'f161f87d9ac8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        'campaign_sessions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('number', sa.Integer(), nullable=False),
        sa.Column('date', sa.String(), nullable=True),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('summary', sa.Text(), nullable=True),
        sa.Column('npcs_involved', sa.Text(), nullable=True),
        sa.Column('loot', sa.Text(), nullable=True),
        sa.Column('next_hook', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
        sa.Column('campaign_id', sa.String(), nullable=False),
        sa.ForeignKeyConstraint(['campaign_id'], ['campaigns.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_campaign_sessions_id'), 'campaign_sessions', ['id'], unique=False)
    op.create_index('ix_campaign_sessions_campaign_id', 'campaign_sessions', ['campaign_id'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index('ix_campaign_sessions_campaign_id', table_name='campaign_sessions')
    op.drop_index(op.f('ix_campaign_sessions_id'), table_name='campaign_sessions')
    op.drop_table('campaign_sessions')