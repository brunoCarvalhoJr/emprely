using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Emprely.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class EmailTransacionalSegurancaConta : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "emails_alteracao_pendente",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UsuarioId = table.Column<Guid>(type: "uuid", nullable: false),
                    EmailAtual = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    NovoEmail = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    Confirmado = table.Column<bool>(type: "boolean", nullable: false),
                    ConfirmadoAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_emails_alteracao_pendente", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "emails_transacionais",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ContaId = table.Column<Guid>(type: "uuid", nullable: true),
                    UsuarioId = table.Column<Guid>(type: "uuid", nullable: true),
                    Tipo = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    Destinatario = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    Assunto = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Status = table.Column<string>(type: "character varying(24)", maxLength: 24, nullable: false),
                    ProviderMessageId = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    Erro = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_emails_transacionais", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "suporte_solicitacoes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ContaId = table.Column<Guid>(type: "uuid", nullable: false),
                    UsuarioId = table.Column<Guid>(type: "uuid", nullable: false),
                    UsuarioNome = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    UsuarioEmail = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    Assunto = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    Mensagem = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: false),
                    Status = table.Column<string>(type: "character varying(24)", maxLength: 24, nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_suporte_solicitacoes", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_emails_alteracao_pendente_UsuarioId",
                table: "emails_alteracao_pendente",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_emails_alteracao_pendente_UsuarioId_NovoEmail_Confirmado",
                table: "emails_alteracao_pendente",
                columns: new[] { "UsuarioId", "NovoEmail", "Confirmado" });

            migrationBuilder.CreateIndex(
                name: "IX_emails_transacionais_ContaId",
                table: "emails_transacionais",
                column: "ContaId");

            migrationBuilder.CreateIndex(
                name: "IX_emails_transacionais_Destinatario_Tipo_CreatedAt",
                table: "emails_transacionais",
                columns: new[] { "Destinatario", "Tipo", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_emails_transacionais_UsuarioId",
                table: "emails_transacionais",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_suporte_solicitacoes_ContaId",
                table: "suporte_solicitacoes",
                column: "ContaId");

            migrationBuilder.CreateIndex(
                name: "IX_suporte_solicitacoes_UsuarioId",
                table: "suporte_solicitacoes",
                column: "UsuarioId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "emails_alteracao_pendente");

            migrationBuilder.DropTable(
                name: "emails_transacionais");

            migrationBuilder.DropTable(
                name: "suporte_solicitacoes");
        }
    }
}
