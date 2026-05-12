using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Emprely.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class PerfilContaMarca : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "perfis_conta",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ContaId = table.Column<Guid>(type: "uuid", nullable: false),
                    NomeComercial = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    EmailContato = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    TelefoneContato = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: true),
                    SiteUrl = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    Instagram = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: true),
                    Documento = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: true),
                    CorPrimaria = table.Column<string>(type: "character varying(7)", maxLength: 7, nullable: false),
                    CorSecundaria = table.Column<string>(type: "character varying(7)", maxLength: 7, nullable: false),
                    LogoUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_perfis_conta", x => x.Id);
                    table.ForeignKey(
                        name: "FK_perfis_conta_contas_ContaId",
                        column: x => x.ContaId,
                        principalTable: "contas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_perfis_conta_ContaId",
                table: "perfis_conta",
                column: "ContaId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "perfis_conta");
        }
    }
}
