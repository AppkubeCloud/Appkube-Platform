package database

import (
	"context"

	"github.com/grafana/grafana/pkg/models"
	"github.com/stretchr/testify/mock"
)

type TeamGuardianStoreMock struct {
	mock.Mock
}

func (t *TeamGuardianStoreMock) GetTeamMembers(ctx context.Context, query models.GetTeamMembersQuery) ([]*models.TeamMemberDTO, error) {
	args := t.Called(ctx, query)
	return args.Get(0).([]*models.TeamMemberDTO), args.Error(1)
}
