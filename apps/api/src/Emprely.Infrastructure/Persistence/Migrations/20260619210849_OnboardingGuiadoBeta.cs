using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Emprely.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class OnboardingGuiadoBeta : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CidadeUf",
                table: "perfis_conta",
                type: "character varying(120)",
                maxLength: 120,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Segmento",
                table: "perfis_conta",
                type: "character varying(80)",
                maxLength: 80,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "onboarding_eventos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ContaId = table.Column<Guid>(type: "uuid", nullable: false),
                    UsuarioId = table.Column<Guid>(type: "uuid", nullable: false),
                    Tipo = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    Etapa = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: true),
                    PropostaId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_onboarding_eventos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_onboarding_eventos_contas_ContaId",
                        column: x => x.ContaId,
                        principalTable: "contas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_onboarding_eventos_usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "onboarding_usuarios",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ContaId = table.Column<Guid>(type: "uuid", nullable: false),
                    UsuarioId = table.Column<Guid>(type: "uuid", nullable: false),
                    StatusConfiguracaoConta = table.Column<string>(type: "character varying(24)", maxLength: 24, nullable: false),
                    EtapaConfiguracaoConta = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    ConfiguracaoContaIniciadaAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    ConfiguracaoContaPuladaAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    ConfiguracaoContaConcluidaAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    StatusPrimeiraProposta = table.Column<string>(type: "character varying(24)", maxLength: 24, nullable: false),
                    EtapaPrimeiraProposta = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    PrimeiraPropostaIniciadaAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    PrimeiraPropostaPuladaAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    PrimeiraPropostaConcluidaAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    PropostaRascunhoId = table.Column<Guid>(type: "uuid", nullable: true),
                    StatusTour = table.Column<string>(type: "character varying(24)", maxLength: 24, nullable: false),
                    TourExibidoAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    TourPuladoAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    TourConcluidoAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_onboarding_usuarios", x => x.Id);
                    table.ForeignKey(
                        name: "FK_onboarding_usuarios_contas_ContaId",
                        column: x => x.ContaId,
                        principalTable: "contas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_onboarding_usuarios_usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_onboarding_eventos_ContaId_UsuarioId_CreatedAt",
                table: "onboarding_eventos",
                columns: new[] { "ContaId", "UsuarioId", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_onboarding_eventos_UsuarioId",
                table: "onboarding_eventos",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_onboarding_usuarios_ContaId_UsuarioId",
                table: "onboarding_usuarios",
                columns: new[] { "ContaId", "UsuarioId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_onboarding_usuarios_UsuarioId",
                table: "onboarding_usuarios",
                column: "UsuarioId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "onboarding_eventos");

            migrationBuilder.DropTable(
                name: "onboarding_usuarios");

            migrationBuilder.DropColumn(
                name: "CidadeUf",
                table: "perfis_conta");

            migrationBuilder.DropColumn(
                name: "Segmento",
                table: "perfis_conta");
        }
    }
}
