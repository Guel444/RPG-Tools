"""add campaign_sessions table

Revision ID: 004_campaign_sessions
Revises: 003_add_campaigns
Create Date: 2026-02-28
"""
from alembic import op
import sqlalchemy as sa

revision = '004_campaign_sessions'
down_revision = '003_add_campaigns'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'campaign_sessions',
        sa.Column('id', sa.Integer(), primary_key=True, index=True),
        sa.Column('number', sa.Integer(), nullable=False),
        sa.Column('date', sa.String(), nullable=True),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('summary', sa.Text(), nullable=True),
        sa.Column('npcs_involved', sa.Text(), nullable=True),
        sa.Column('loot', sa.Text(), nullable=True),
        sa.Column('next_hook', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('campaign_id', sa.String(), sa.ForeignKey('campaigns.id', ondelete='CASCADE'), nullable=False),
    )
    op.create_index('ix_campaign_sessions_campaign_id', 'campaign_sessions', ['campaign_id'])
    op.create_index('ix_campaign_sessions_number', 'campaign_sessions', ['campaign_id', 'number'])


def downgrade():
    op.drop_index('ix_campaign_sessions_number', 'campaign_sessions')
    op.drop_index('ix_campaign_sessions_campaign_id', 'campaign_sessions')
    op.drop_table('campaign_sessions')