using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Emprely.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AdminUsuariosPlanosEmails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "BloqueadoAdministrativamenteAt",
                table: "usuarios",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "CreatedAt",
                table: "usuarios",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));

            migrationBuilder.CreateTable(
                name: "admin_auditorias",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AdminUsuarioId = table.Column<Guid>(type: "uuid", nullable: false),
                    AdminEmail = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    AdminPerfil = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    Acao = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    AlvoTipo = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    AlvoId = table.Column<Guid>(type: "uuid", nullable: true),
                    Motivo = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    Detalhes = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: true),
                    Ip = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: true),
                    UserAgent = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Resultado = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_admin_auditorias", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "admin_usuarios",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Nome = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    Email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    SenhaHash = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    Perfil = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    Status = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    UltimoLoginAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_admin_usuarios", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "dias_gratis_conta",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ContaId = table.Column<Guid>(type: "uuid", nullable: false),
                    InicioAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    FimAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    Motivo = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    CriadoPorAdminId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_dias_gratis_conta", x => x.Id);
                    table.ForeignKey(
                        name: "FK_dias_gratis_conta_contas_ContaId",
                        column: x => x.ContaId,
                        principalTable: "contas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_admin_auditorias_AdminUsuarioId",
                table: "admin_auditorias",
                column: "AdminUsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_admin_auditorias_AlvoTipo_AlvoId",
                table: "admin_auditorias",
                columns: new[] { "AlvoTipo", "AlvoId" });

            migrationBuilder.CreateIndex(
                name: "IX_admin_auditorias_CreatedAt",
                table: "admin_auditorias",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_admin_usuarios_Email",
                table: "admin_usuarios",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_dias_gratis_conta_ContaId",
                table: "dias_gratis_conta",
                column: "ContaId");

            migrationBuilder.CreateIndex(
                name: "IX_dias_gratis_conta_ContaId_InicioAt_FimAt",
                table: "dias_gratis_conta",
                columns: new[] { "ContaId", "InicioAt", "FimAt" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "admin_auditorias");

            migrationBuilder.DropTable(
                name: "admin_usuarios");

            migrationBuilder.DropTable(
                name: "dias_gratis_conta");

            migrationBuilder.DropColumn(
                name: "BloqueadoAdministrativamenteAt",
                table: "usuarios");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "usuarios");
        }
    }
}
