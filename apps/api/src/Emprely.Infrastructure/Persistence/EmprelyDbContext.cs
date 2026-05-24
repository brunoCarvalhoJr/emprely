using Emprely.Domain.Clientes;
using Emprely.Domain.Contas;
using Emprely.Domain.Propostas;
using Emprely.Domain.Servicos;
using Emprely.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Emprely.Infrastructure.Persistence;

public sealed class EmprelyDbContext
    : IdentityDbContext<UsuarioAplicacao, IdentityRole<Guid>, Guid>
{
    public EmprelyDbContext(DbContextOptions<EmprelyDbContext> options)
        : base(options)
    {
    }

    public DbSet<Conta> Contas => Set<Conta>();

    public DbSet<MembroConta> MembrosConta => Set<MembroConta>();

    public DbSet<PerfilConta> PerfisConta => Set<PerfilConta>();

    public DbSet<Cliente> Clientes => Set<Cliente>();

    public DbSet<Servico> Servicos => Set<Servico>();

    public DbSet<Proposta> Propostas => Set<Proposta>();

    public DbSet<PropostaItem> PropostaItens => Set<PropostaItem>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        ConfigureIdentity(builder);
        ConfigureConta(builder);
        ConfigurePerfilConta(builder);
        ConfigureMembroConta(builder);
        ConfigureCliente(builder);
        ConfigureServico(builder);
        ConfigureProposta(builder);
        ConfigurePropostaItem(builder);
    }

    private static void ConfigureIdentity(ModelBuilder builder)
    {
        builder.Entity<UsuarioAplicacao>(entity =>
        {
            entity.ToTable("usuarios");
            entity.Property(usuario => usuario.Nome).HasMaxLength(160).IsRequired();
        });

        builder.Entity<IdentityRole<Guid>>().ToTable("perfis_acesso");
        builder.Entity<IdentityUserRole<Guid>>().ToTable("usuarios_perfis_acesso");
        builder.Entity<IdentityUserClaim<Guid>>().ToTable("usuarios_claims");
        builder.Entity<IdentityUserLogin<Guid>>().ToTable("usuarios_logins");
        builder.Entity<IdentityRoleClaim<Guid>>().ToTable("perfis_acesso_claims");
        builder.Entity<IdentityUserToken<Guid>>().ToTable("usuarios_tokens");
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
            entity.Property(perfil => perfil.CorPrimaria).HasMaxLength(7).IsRequired();
            entity.Property(perfil => perfil.CorSecundaria).HasMaxLength(7).IsRequired();
            entity.Property(perfil => perfil.CorSistemaPrimaria).HasMaxLength(7).IsRequired();
            entity.Property(perfil => perfil.CorSistemaSecundaria).HasMaxLength(7).IsRequired();
            entity.Property(perfil => perfil.LogoUrl).HasMaxLength(500);
            entity.Property(perfil => perfil.TemplateVisualPadrao).HasConversion<string>().HasMaxLength(40).IsRequired();
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
            entity.Ignore(proposta => proposta.Subtotal);
            entity.Ignore(proposta => proposta.Total);
            entity.HasIndex(proposta => proposta.ContaId);
            entity.HasIndex(proposta => proposta.ClienteId);
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
}
