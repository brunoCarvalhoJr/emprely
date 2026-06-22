namespace Emprely.Contracts.Proposals;

public sealed record PublicProposalApprovalResponse(
    string Status,
    string Message,
    string? ProposalTitle,
    string? ClientName,
    DateTimeOffset? AcceptedAt);
