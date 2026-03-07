"""remove current_session from campaigns

Revision ID: b7d4e1f02c85
Revises: a3f8c2e91d04
Create Date: 2026-03-01 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b7d4e1f02c85'
down_revision: Union[str, Sequence[str], None] = 'a3f8c2e91d04'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Remove current_session — replaced by campaign_sessions table."""
    with op.batch_alter_table('campaigns') as batch_op:
        batch_op.drop_column('current_session')


def downgrade() -> None:
    """Restore current_session column."""
    with op.batch_alter_table('campaigns') as batch_op:
        batch_op.add_column(sa.Column('current_session', sa.Integer(), nullable=True))