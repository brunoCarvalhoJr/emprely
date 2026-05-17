using Emprely.Domain.Contas;

namespace Emprely.UnitTests.Contas;

public sealed class ContaTests
{
    [Fact]
    public void CreateConta_DeveNascerComTrialAtivo()
    {
        var conta = Conta.CreateConta(" Emprely ");

        Assert.Equal("Emprely", conta.Nome);
        Assert.Equal(PlanoConta.Trial, conta.Plano);
        Assert.Equal(StatusComercialConta.TrialAtivo, conta.GetStatusComercialConta(DateTimeOffset.UtcNow));
        Assert.True(conta.TrialEndsAt > DateTimeOffset.UtcNow);
        Assert.InRange(conta.GetDiasRestantesTrial(DateTimeOffset.UtcNow), 1, Conta.TrialDias);
    }

    [Fact]
    public void GetStatusComercialConta_DeveIndicarTrialExpirado()
    {
        var conta = Conta.CreateConta("Emprely");
        var depoisDoTrial = conta.TrialEndsAt.AddSeconds(1);

        Assert.Equal(StatusComercialConta.TrialExpirado, conta.GetStatusComercialConta(depoisDoTrial));
        Assert.Equal(0, conta.GetDiasRestantesTrial(depoisDoTrial));
        Assert.False(conta.CanGenerateProposta(depoisDoTrial));
    }

    [Fact]
    public void ActivatePlanoFundador_DeveMudarPlanoEStatus()
    {
        var conta = Conta.CreateConta("Emprely");

        conta.ActivatePlanoFundador();

        Assert.Equal(PlanoConta.Fundador, conta.Plano);
        Assert.Equal(StatusComercialConta.FundadorAtivo, conta.GetStatusComercialConta(DateTimeOffset.UtcNow));
        Assert.NotNull(conta.PlanoFundadorAtivadoAt);
        Assert.NotNull(conta.UpdatedAt);
        Assert.Equal(0, conta.GetDiasRestantesTrial(DateTimeOffset.UtcNow));
        Assert.True(conta.CanGenerateProposta(conta.TrialEndsAt.AddDays(30)));
    }

    [Fact]
    public void ActivatePlanoFundador_DeveSerIdempotente()
    {
        var conta = Conta.CreateConta("Emprely");

        conta.ActivatePlanoFundador();
        var ativadoEm = conta.PlanoFundadorAtivadoAt;
        var updatedAt = conta.UpdatedAt;

        conta.ActivatePlanoFundador();

        Assert.Equal(PlanoConta.Fundador, conta.Plano);
        Assert.Equal(ativadoEm, conta.PlanoFundadorAtivadoAt);
        Assert.Equal(updatedAt, conta.UpdatedAt);
    }

    [Fact]
    public void CanGenerateProposta_DevePermitirTrialAtivo()
    {
        var conta = Conta.CreateConta("Emprely");

        Assert.True(conta.CanGenerateProposta(DateTimeOffset.UtcNow));
    }
}
