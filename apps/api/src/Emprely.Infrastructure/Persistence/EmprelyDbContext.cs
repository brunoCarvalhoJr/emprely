using Emprely.Domain.Admin;
using Emprely.Domain.Clientes;
using Emprely.Domain.Comunicacoes;
using Emprely.Domain.Contas;
using Emprely.Domain.Onboarding;
using Emprely.Domain.Pagamentos;
using Emprely.Domain.Propostas;
using Emprely.Domain.Servicos;
using Emprely.Domain.Suporte;
using Microsoft.AspNetCore.DataProtection.EntityFrameworkCore;
using Emprely.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Emprely.Infrastructure.Persistence;

public sealed class EmprelyDbContext
    : IdentityDbContext<UsuarioAplicacao, IdentityRole<Guid>, Guid>, IDataProtectionKeyContext
{
    public EmprelyDbContext(DbContextOptions<EmprelyDbContext> options)
        : base(options)
    {
    }

    public DbSet<Conta> Contas => Set<Conta>();

    public DbSet<AdminUsuario> AdminUsuarios => Set<AdminUsuario>();

    public DbSet<AdminAuditoria> AdminAuditorias => Set<AdminAuditoria>();

    public DbSet<MembroConta> MembrosConta => Set<MembroConta>();

    public DbSet<DiasGratisConta> DiasGratisConta => Set<DiasGratisConta>();

    public DbSet<PerfilConta> PerfisConta => Set<PerfilConta>();

    public DbSet<Cliente> Clientes => Set<Cliente>();

    public DbSet<Servico> Servicos => Set<Servico>();

    public DbSet<Proposta> Propostas => Set<Proposta>();

    public DbSet<PropostaItem> PropostaItens => Set<PropostaItem>();

    public DbSet<EmailTransacional> EmailsTransacionais => Set<EmailTransacional>();

    public DbSet<EmailAlteracaoPendente> EmailsAlteracaoPendente => Set<EmailAlteracaoPendente>();

    public DbSet<SuporteSolicitacao> SuporteSolicitacoes => Set<SuporteSolicitacao>();

    public DbSet<OnboardingUsuario> OnboardingUsuarios => Set<OnboardingUsuario>();

    public DbSet<OnboardingEvento> OnboardingEventos => Set<OnboardingEvento>();

    public DbSet<AssinaturaConta> AssinaturasConta => Set<AssinaturaConta>();

    public DbSet<PagamentoConta> PagamentosConta => Set<PagamentoConta>();

    public DbSet<EventoWebhookPagamento> EventosWebhookPagamento => Set<EventoWebhookPagamento>();

    public DbSet<HistoricoAssinaturaConta> HistoricosAssinaturaConta => Set<HistoricoAssinaturaConta>();

    public DbSet<BillingContaLock> BillingContaLocks => Set<BillingContaLock>();

    public DbSet<DataProtectionKey> DataProtectionKeys => Set<DataProtectionKey>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        ConfigureIdentity(builder);
        ConfigureAdminUsuario(builder);
        ConfigureAdminAuditoria(builder);
        ConfigureConta(builder);
        ConfigureDiasGratisConta(builder);
        ConfigurePerfilConta(builder);
        ConfigureMembroConta(builder);
        ConfigureCliente(builder);
        ConfigureServico(builder);
        ConfigureProposta(builder);
        ConfigurePropostaItem(builder);
        ConfigureEmailTransacional(builder);
        ConfigureEmailAlteracaoPendente(builder);
        ConfigureSuporteSolicitacao(builder);
        ConfigureOnboardingUsuario(builder);
        ConfigureOnboardingEvento(builder);
        ConfigureAssinaturaConta(builder);
        ConfigurePagamentoConta(builder);
        ConfigureEventoWebhookPagamento(builder);
        ConfigureHistoricoAssinaturaConta(builder);
        ConfigureBillingContaLock(builder);
        ConfigureDataProtectionKeys(builder);
    }

    private static void ConfigureIdentity(ModelBuilder builder)
    {
        builder.Entity<UsuarioAplicacao>(entity =>
        {
            entity.ToTable("usuarios");
            entity.Property(usuario => usuario.Nome).HasMaxLength(160).IsRequired();
            entity.Property(usuario => usuario.CreatedAt).IsRequired();
            entity.Property(usuario => usuario.BloqueadoAdministrativamenteAt);
        });

        builder.Entity<IdentityRole<Guid>>().ToTable("perfis_acesso");
        builder.Entity<IdentityUserRole<Guid>>().ToTable("usuarios_perfis_acesso");
        builder.Entity<IdentityUserClaim<Guid>>().ToTable("usuarios_claims");
        builder.Entity<IdentityUserLogin<Guid>>().ToTable("usuarios_logins");
        builder.Entity<IdentityRoleClaim<Guid>>().ToTable("perfis_acesso_claims");
        builder.Entity<IdentityUserToken<Guid>>().ToTable("usuarios_tokens");
    }

    private static void ConfigureAdminUsuario(ModelBuilder builder)
    {
        builder.Entity<AdminUsuario>(entity =>
        {
            entity.ToTable("admin_usuarios");
            entity.HasKey(admin => admin.Id);
            entity.Property(admin => admin.Nome).HasMaxLength(160).IsRequired();
            entity.Property(admin => admin.Email).HasMaxLength(256).IsRequired();
            entity.Property(admin => admin.SenhaHash).HasMaxLength(1000).IsRequired();
            entity.Property(admin => admin.Perfil).HasConversion<string>().HasMaxLength(40).IsRequired();
            entity.Property(admin => admin.Status).HasConversion<string>().HasMaxLength(40).IsRequired();
            entity.Property(admin => admin.UltimoLoginAt);
            entity.HasIndex(admin => admin.Email).IsUnique();
        });
    }

    private static void ConfigureAdminAuditoria(ModelBuilder builder)
    {
        builder.Entity<AdminAuditoria>(entity =>
        {
            entity.ToTable("admin_auditorias");
            entity.HasKey(auditoria => auditoria.Id);
            entity.Property(auditoria => auditoria.AdminEmail).HasMaxLength(256).IsRequired();
            entity.Property(auditoria => auditoria.AdminPerfil).HasMaxLength(40).IsRequired();
            entity.Property(auditoria => auditoria.Acao).HasMaxLength(80).IsRequired();
            entity.Property(auditoria => auditoria.AlvoTipo).HasMaxLength(80).IsRequired();
            entity.Property(auditoria => auditoria.Motivo).HasMaxLength(1000);
            entity.Property(auditoria => auditoria.Detalhes).HasMaxLength(4000);
            entity.Property(auditoria => auditoria.Ip).HasMaxLength(80);
            entity.Property(auditoria => auditoria.UserAgent).HasMaxLength(500);
            entity.Property(auditoria => auditoria.Resultado).HasMaxLength(80).IsRequired();
            entity.HasIndex(auditoria => auditoria.AdminUsuarioId);
            entity.HasIndex(auditoria => new { auditoria.AlvoTipo, auditoria.AlvoId });
            entity.HasIndex(auditoria => auditoria.CreatedAt);
        });
    }

    private static void ConfigureConta(ModelBuilder builder)
    {
        builder.Entity<Conta>(entity =>
        {
            entity.ToTable("contas");
            entity.HasKey(conta => conta.Id);
            entity.Property(conta => conta.Nome).HasMaxLength(160).IsRequired();
            entity.Property(conta => conta.Slug).HasMaxLength(80).IsRequired();
            entity.Property(conta => conta.Status).HasConversion<string>().HasMaxLength(24);
            entity.Property(conta => conta.Plano).HasConversion<string>().HasMaxLength(24);
            entity.Property(conta => conta.TrialEndsAt).IsRequired();
            entity.Property(conta => conta.PlanoFundadorAtivadoAt);
            entity.HasIndex(conta => conta.Slug).IsUnique();
        });
    }

    private static void ConfigureDiasGratisConta(ModelBuilder builder)
    {
        builder.Entity<DiasGratisConta>(entity =>
        {
            entity.ToTable("dias_gratis_conta");
            entity.HasKey(diasGratis => diasGratis.Id);
            entity.Property(diasGratis => diasGratis.InicioAt).IsRequired();
            entity.Property(diasGratis => diasGratis.FimAt).IsRequired();
            entity.Property(diasGratis => diasGratis.Motivo).HasMaxLength(1000).IsRequired();
            entity.HasIndex(diasGratis => diasGratis.ContaId);
            entity.HasIndex(diasGratis => new { diasGratis.ContaId, diasGratis.InicioAt, diasGratis.FimAt });
            entity.HasOne(diasGratis => diasGratis.Conta)
                .WithMany()
                .HasForeignKey(diasGratis => diasGratis.ContaId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }

    private static void ConfigureMembroConta(ModelBuilder builder)
    {
        builder.Entity<MembroConta>(entity =>
        {
            entity.ToTable("membros_conta");
            entity.HasKey(membro => membro.Id);
            entity.Property(membro => membro.Papel).HasConversion<string>().HasMaxLength(24);
            entity.Property(membro => membro.Status).HasConversion<string>().HasMaxLength(24);
            entity.HasIndex(membro => new { membro.ContaId, membro.UsuarioId }).IsUnique();
            entity.HasOne(membro => membro.Conta)
                .WithMany(conta => conta.Membros)
                .HasForeignKey(membro => membro.ContaId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne<UsuarioAplicacao>()
                .WithMany()
                .HasForeignKey(membro => membro.UsuarioId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }

    private static void ConfigurePerfilConta(ModelBuilder builder)
    {
        builder.Entity<PerfilConta>(entity =>
        {
            entity.ToTable("perfis_conta");
            entity.HasKey(perfil => perfil.Id);
            entity.Property(perfil => perfil.NomeComercial).HasMaxLength(160).IsRequired();
            entity.Property(perfil => perfil.EmailContato).HasMaxLength(256);
            entity.Property(perfil => perfil.TelefoneContato).HasMaxLength(40);
            entity.Property(perfil => perfil.SiteUrl).HasMaxLength(300);
            entity.Property(perfil => perfil.Instagram).HasMaxLength(80);
            entity.Property(perfil => perfil.Documento).HasMaxLength(40);
            entity.Property(perfil => perfil.Segmento).HasMaxLength(80);
            entity.Property(perfil => perfil.CidadeUf).HasMaxLength(120);
            entity.Property(perfil => perfil.CorPrimaria).HasMaxLength(7).IsRequired();
            entity.Property(perfil => perfil.CorSecundaria).HasMaxLength(7).IsRequired();
            entity.Property(perfil => perfil.CorSistemaPrimaria).HasMaxLength(7).IsRequired();
            entity.Property(perfil => perfil.CorSistemaSecundaria).HasMaxLength(7).IsRequired();
            entity.Property(perfil => perfil.LogoUrl).HasMaxLength(500);
            entity.Property(perfil => perfil.TemplateVisualPadrao).HasConversion<string>().HasMaxLength(40).IsRequired();
            entity.Property(perfil => perfil.FormatoArquivoPreferido).HasMaxLength(20).IsRequired();
            entity.HasIndex(perfil => perfil.ContaId).IsUnique();
            entity.HasOne(perfil => perfil.Conta)
                .WithOne(conta => conta.Perfil)
                .HasForeignKey<PerfilConta>(perfil => perfil.ContaId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }

    private static void ConfigureCliente(ModelBuilder builder)
    {
        builder.Entity<Cliente>(entity =>
        {
            entity.ToTable("clientes");
            entity.HasKey(cliente => cliente.Id);
            entity.Property(cliente => cliente.Nome).HasMaxLength(160).IsRequired();
            entity.Property(cliente => cliente.Email).HasMaxLength(256);
            entity.Property(cliente => cliente.Telefone).HasMaxLength(40);
            entity.Property(cliente => cliente.Documento).HasMaxLength(40);
            entity.Property(cliente => cliente.Endereco).HasMaxLength(200);
            entity.Property(cliente => cliente.Numero).HasMaxLength(30);
            entity.Property(cliente => cliente.Cidade).HasMaxLength(120);
            entity.Property(cliente => cliente.Instagram).HasMaxLength(160);
            entity.Property(cliente => cliente.Facebook).HasMaxLength(160);
            entity.Property(cliente => cliente.TikTok).HasMaxLength(160);
            entity.Property(cliente => cliente.Observacoes).HasMaxLength(1000);
            entity.Property(cliente => cliente.Status).HasConversion<string>().HasMaxLength(24);
            entity.HasIndex(cliente => cliente.ContaId);
            entity.HasIndex(cliente => new { cliente.ContaId, cliente.Nome });
            entity.HasOne(cliente => cliente.Conta)
                .WithMany(conta => conta.Clientes)
                .HasForeignKey(cliente => cliente.ContaId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }

    private static void ConfigureAssinaturaConta(ModelBuilder builder)
    {
        builder.Entity<AssinaturaConta>(entity =>
        {
            entity.ToTable("assinaturas_conta");
            entity.HasKey(assinatura => assinatura.Id);
            entity.Property(assinatura => assinatura.PlanoCodigo).HasMaxLength(40).IsRequired();
            entity.Property(assinatura => assinatura.Provedor).HasConversion<string>().HasMaxLength(40).IsRequired();
            entity.Property(assinatura => assinatura.ProviderCustomerId).HasMaxLength(120);
            entity.Property(assinatura => assinatura.ProviderSubscriptionId).HasMaxLength(120);
            entity.Property(assinatura => assinatura.Status).HasConversion<string>().HasMaxLength(40).IsRequired();
            entity.Property(assinatura => assinatura.MetodoPagamento).HasConversion<string>().HasMaxLength(40).IsRequired();
            entity.Property(assinatura => assinatura.Ciclo).HasConversion<string>().HasMaxLength(20).HasDefaultValue(CicloPlano.Mensal).IsRequired();
            entity.Property(assinatura => assinatura.Valor).HasPrecision(10, 2).IsRequired();
            entity.Property(assinatura => assinatura.Moeda).HasMaxLength(3).IsRequired();
            entity.Property(assinatura => assinatura.MotivoCancelamento).HasMaxLength(1000);
            entity.HasIndex(assinatura => assinatura.ContaId);
            entity.HasIndex(assinatura => assinatura.ProviderSubscriptionId).IsUnique();
            entity.HasOne(assinatura => assinatura.Conta)
                .WithMany()
                .HasForeignKey(assinatura => assinatura.ContaId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }

    private static void ConfigurePagamentoConta(ModelBuilder builder)
    {
        builder.Entity<PagamentoConta>(entity =>
        {
            entity.ToTable("pagamentos_conta");
            entity.HasKey(pagamento => pagamento.Id);
            entity.Property(pagamento => pagamento.PlanoCodigo).HasMaxLength(40).IsRequired();
            entity.Property(pagamento => pagamento.Provedor).HasConversion<string>().HasMaxLength(40).IsRequired();
            entity.Property(pagamento => pagamento.ProviderPaymentId).HasMaxLength(120);
            entity.Property(pagamento => pagamento.ProviderCheckoutId).HasMaxLength(120);
            entity.Property(pagamento => pagamento.ProviderSubscriptionId).HasMaxLength(120);
            entity.Property(pagamento => pagamento.ExternalReference).HasMaxLength(160);
            entity.Property(pagamento => pagamento.Status).HasConversion<string>().HasMaxLength(40).IsRequired();
            entity.Property(pagamento => pagamento.MetodoPagamento).HasConversion<string>().HasMaxLength(40).IsRequired();
            entity.Property(pagamento => pagamento.Ciclo).HasConversion<string>().HasMaxLength(20).HasDefaultValue(CicloPlano.Mensal).IsRequired();
            entity.Property(pagamento => pagamento.Valor).HasPrecision(10, 2).IsRequired();
            entity.Property(pagamento => pagamento.RefundedAmount).HasPrecision(10, 2);
            entity.Property(pagamento => pagamento.Moeda).HasMaxLength(3).IsRequired();
            entity.Property(pagamento => pagamento.InvoiceUrl).HasMaxLength(1000);
            entity.Property(pagamento => pagamento.PixQrCodePayload).HasMaxLength(2000);
            entity.HasIndex(pagamento => pagamento.ContaId);
            entity.HasIndex(pagamento => pagamento.AssinaturaContaId);
            entity.HasIndex(pagamento => pagamento.ProviderPaymentId).IsUnique();
            entity.HasOne(pagamento => pagamento.Conta)
                .WithMany()
                .HasForeignKey(pagamento => pagamento.ContaId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(pagamento => pagamento.AssinaturaConta)
                .WithMany()
                .HasForeignKey(pagamento => pagamento.AssinaturaContaId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }

    private static void ConfigureEventoWebhookPagamento(ModelBuilder builder)
    {
        builder.Entity<EventoWebhookPagamento>(entity =>
        {
            entity.ToTable("eventos_webhook_pagamento");
            entity.HasKey(evento => evento.Id);
            entity.Property(evento => evento.Provedor).HasConversion<string>().HasMaxLength(40).IsRequired();
            entity.Property(evento => evento.ProviderEventId).HasMaxLength(160).IsRequired();
            entity.Property(evento => evento.TipoEvento).HasMaxLength(120).IsRequired();
            entity.Property(evento => evento.ProviderResourceId).HasMaxLength(160);
            entity.Property(evento => evento.StatusProcessamento).HasConversion<string>().HasMaxLength(40).IsRequired();
            entity.Property(evento => evento.PayloadJson).IsRequired();
            entity.Property(evento => evento.ErroProcessamento).HasMaxLength(1000);
            entity.Property(evento => evento.TentativasProcessamento).HasDefaultValue(0);
            entity.Property(evento => evento.ProximaTentativaAt);
            entity.HasIndex(evento => new { evento.Provedor, evento.ProviderEventId }).IsUnique();
            entity.HasIndex(evento => evento.ProviderResourceId);
        });
    }

    private static void ConfigureHistoricoAssinaturaConta(ModelBuilder builder)
    {
        builder.Entity<HistoricoAssinaturaConta>(entity =>
        {
            entity.ToTable("historicos_assinatura_conta");
            entity.HasKey(historico => historico.Id);
            entity.Property(historico => historico.Evento).HasMaxLength(80).IsRequired();
            entity.Property(historico => historico.Detalhes).HasMaxLength(2000);
            entity.HasIndex(historico => historico.ContaId);
            entity.HasIndex(historico => historico.AssinaturaContaId);
            entity.HasIndex(historico => historico.PagamentoContaId);
            entity.HasIndex(historico => historico.CreatedAt);
        });
    }

    private static void ConfigureBillingContaLock(ModelBuilder builder)
    {
        builder.Entity<BillingContaLock>(entity =>
        {
            entity.ToTable("billing_conta_locks");
            entity.HasKey(lockConta => lockConta.Id);
            entity.Property(lockConta => lockConta.TouchedAt).IsRequired();
            entity.HasIndex(lockConta => lockConta.ContaId).IsUnique();
        });
    }

    private static void ConfigureServico(ModelBuilder builder)
    {
        builder.Entity<Servico>(entity =>
        {
            entity.ToTable("servicos");
            entity.HasKey(servico => servico.Id);
            entity.Property(servico => servico.Nome).HasMaxLength(160).IsRequired();
            entity.Property(servico => servico.Descricao).HasMaxLength(1000);
            entity.Property(servico => servico.Categoria).HasMaxLength(80);
            entity.Property(servico => servico.Preco).HasPrecision(12, 2);
            entity.Property(servico => servico.Unidade).HasConversion<string>().HasMaxLength(24);
            entity.Property(servico => servico.Tipo).HasConversion<string>().HasMaxLength(24);
            entity.Property(servico => servico.Status).HasConversion<string>().HasMaxLength(24);
            entity.HasIndex(servico => servico.ContaId);
            entity.HasIndex(servico => new { servico.ContaId, servico.Nome });
            entity.HasOne(servico => servico.Conta)
                .WithMany(conta => conta.Servicos)
                .HasForeignKey(servico => servico.ContaId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }

    private static void ConfigureProposta(ModelBuilder builder)
    {
        builder.Entity<Proposta>(entity =>
        {
            entity.ToTable("propostas");
            entity.HasKey(proposta => proposta.Id);
            entity.Property(proposta => proposta.Numero).IsRequired();
            entity.Property(proposta => proposta.Titulo).HasMaxLength(160).IsRequired();
            entity.Property(proposta => proposta.Introducao).HasMaxLength(1000);
            entity.Property(proposta => proposta.Observacoes).HasMaxLength(1000);
            entity.Property(proposta => proposta.Status).HasConversion<string>().HasMaxLength(24);
            entity.Property(proposta => proposta.TemplateVisual).HasConversion<string>().HasMaxLength(40).IsRequired();
            entity.Property(proposta => proposta.DescontoValor).HasPrecision(12, 2);
            entity.Property(proposta => proposta.CondicoesPagamento).HasMaxLength(1000);
            entity.Property(proposta => proposta.ItensInclusosTexto).HasMaxLength(4000);
            entity.Property(proposta => proposta.ItensNaoInclusosTexto).HasMaxLength(4000);
            entity.Property(proposta => proposta.CronogramaTexto).HasMaxLength(4000);
            entity.Property(proposta => proposta.BeneficiosTexto).HasMaxLength(4000);
            entity.Property(proposta => proposta.PublicApprovalTokenHash).HasMaxLength(128);
            entity.Property(proposta => proposta.PublicApprovalAcceptedIp).HasMaxLength(80);
            entity.Property(proposta => proposta.PublicApprovalAcceptedUserAgent).HasMaxLength(500);
            entity.Ignore(proposta => proposta.Subtotal);
            entity.Ignore(proposta => proposta.Total);
            entity.HasIndex(proposta => proposta.ContaId);
            entity.HasIndex(proposta => proposta.ClienteId);
            entity.HasIndex(proposta => proposta.PublicApprovalTokenHash).IsUnique();
            entity.HasIndex(proposta => new { proposta.ContaId, proposta.Status });
            entity.HasIndex(proposta => new { proposta.ContaId, proposta.Numero }).IsUnique();
            entity.HasOne(proposta => proposta.Conta)
                .WithMany(conta => conta.Propostas)
                .HasForeignKey(proposta => proposta.ContaId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(proposta => proposta.Cliente)
                .WithMany(cliente => cliente.Propostas)
                .HasForeignKey(proposta => proposta.ClienteId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }

    private static void ConfigurePropostaItem(ModelBuilder builder)
    {
        builder.Entity<PropostaItem>(entity =>
        {
            entity.ToTable("proposta_itens");
            entity.HasKey(item => item.Id);
            entity.Property(item => item.Nome).HasMaxLength(160).IsRequired();
            entity.Property(item => item.Descricao).HasMaxLength(1000);
            entity.Property(item => item.Quantidade).HasPrecision(12, 2);
            entity.Property(item => item.ValorUnitario).HasPrecision(12, 2);
            entity.Ignore(item => item.Total);
            entity.HasIndex(item => item.PropostaId);
            entity.HasIndex(item => item.ServicoId);
            entity.HasOne(item => item.Proposta)
                .WithMany(proposta => proposta.Itens)
                .HasForeignKey(item => item.PropostaId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(item => item.Servico)
                .WithMany(servico => servico.ItensProposta)
                .HasForeignKey(item => item.ServicoId)
                .OnDelete(DeleteBehavior.SetNull);
        });
    }

    private static void ConfigureEmailTransacional(ModelBuilder builder)
    {
        builder.Entity<EmailTransacional>(entity =>
        {
            entity.ToTable("emails_transacionais");
            entity.HasKey(email => email.Id);
            entity.Property(email => email.Tipo).HasConversion<string>().HasMaxLength(40).IsRequired();
            entity.Property(email => email.Destinatario).HasMaxLength(256).IsRequired();
            entity.Property(email => email.Assunto).HasMaxLength(200).IsRequired();
            entity.Property(email => email.Status).HasConversion<string>().HasMaxLength(24).IsRequired();
            entity.Property(email => email.ProviderMessageId).HasMaxLength(200);
            entity.Property(email => email.TokenHash).HasMaxLength(128);
            entity.Property(email => email.Erro).HasMaxLength(1000);
            entity.HasIndex(email => email.ContaId);
            entity.HasIndex(email => email.UsuarioId);
            entity.HasIndex(email => new { email.Destinatario, email.Tipo, email.CreatedAt });
        });
    }

    private static void ConfigureEmailAlteracaoPendente(ModelBuilder builder)
    {
        builder.Entity<EmailAlteracaoPendente>(entity =>
        {
            entity.ToTable("emails_alteracao_pendente");
            entity.HasKey(email => email.Id);
            entity.Property(email => email.EmailAtual).HasMaxLength(256).IsRequired();
            entity.Property(email => email.NovoEmail).HasMaxLength(256).IsRequired();
            entity.HasIndex(email => email.UsuarioId);
            entity.HasIndex(email => new { email.UsuarioId, email.NovoEmail, email.Confirmado });
        });
    }

    private static void ConfigureSuporteSolicitacao(ModelBuilder builder)
    {
        builder.Entity<SuporteSolicitacao>(entity =>
        {
            entity.ToTable("suporte_solicitacoes");
            entity.HasKey(suporte => suporte.Id);
            entity.Property(suporte => suporte.UsuarioNome).HasMaxLength(160).IsRequired();
            entity.Property(suporte => suporte.UsuarioEmail).HasMaxLength(256).IsRequired();
            entity.Property(suporte => suporte.Assunto).HasMaxLength(120).IsRequired();
            entity.Property(suporte => suporte.Mensagem).HasMaxLength(4000).IsRequired();
            entity.Property(suporte => suporte.Status).HasConversion<string>().HasMaxLength(24).IsRequired();
            entity.HasIndex(suporte => suporte.ContaId);
            entity.HasIndex(suporte => suporte.UsuarioId);
        });
    }

    private static void ConfigureOnboardingUsuario(ModelBuilder builder)
    {
        builder.Entity<OnboardingUsuario>(entity =>
        {
            entity.ToTable("onboarding_usuarios");
            entity.HasKey(onboarding => onboarding.Id);
            entity.Property(onboarding => onboarding.StatusConfiguracaoConta).HasMaxLength(24).IsRequired();
            entity.Property(onboarding => onboarding.EtapaConfiguracaoConta).HasMaxLength(80).IsRequired();
            entity.Property(onboarding => onboarding.StatusPrimeiraProposta).HasMaxLength(24).IsRequired();
            entity.Property(onboarding => onboarding.EtapaPrimeiraProposta).HasMaxLength(80).IsRequired();
            entity.Property(onboarding => onboarding.StatusTour).HasMaxLength(24).IsRequired();
            entity.HasIndex(onboarding => new { onboarding.ContaId, onboarding.UsuarioId }).IsUnique();
            entity.HasOne(onboarding => onboarding.Conta)
                .WithMany()
                .HasForeignKey(onboarding => onboarding.ContaId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne<UsuarioAplicacao>()
                .WithMany()
                .HasForeignKey(onboarding => onboarding.UsuarioId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }

    private static void ConfigureOnboardingEvento(ModelBuilder builder)
    {
        builder.Entity<OnboardingEvento>(entity =>
        {
            entity.ToTable("onboarding_eventos");
            entity.HasKey(evento => evento.Id);
            entity.Property(evento => evento.Tipo).HasMaxLength(80).IsRequired();
            entity.Property(evento => evento.Etapa).HasMaxLength(80);
            entity.HasIndex(evento => new { evento.ContaId, evento.UsuarioId, evento.CreatedAt });
            entity.HasOne(evento => evento.Conta)
                .WithMany()
                .HasForeignKey(evento => evento.ContaId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne<UsuarioAplicacao>()
                .WithMany()
                .HasForeignKey(evento => evento.UsuarioId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }

    private static void ConfigureDataProtectionKeys(ModelBuilder builder)
    {
        builder.Entity<DataProtectionKey>(entity =>
        {
            entity.ToTable("data_protection_keys");
            entity.HasKey(key => key.Id);
            entity.Property(key => key.FriendlyName).HasMaxLength(200);
            entity.Property(key => key.Xml).IsRequired();
        });
    }
}
