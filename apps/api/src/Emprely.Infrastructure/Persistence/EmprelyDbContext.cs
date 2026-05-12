using Emprely.Domain.Contas;
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

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        ConfigureIdentity(builder);
        ConfigureConta(builder);
        ConfigurePerfilConta(builder);
        ConfigureMembroConta(builder);
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
            entity.Property(perfil => perfil.LogoUrl).HasMaxLength(500);
            entity.HasIndex(perfil => perfil.ContaId).IsUnique();
            entity.HasOne(perfil => perfil.Conta)
                .WithOne(conta => conta.Perfil)
                .HasForeignKey<PerfilConta>(perfil => perfil.ContaId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
