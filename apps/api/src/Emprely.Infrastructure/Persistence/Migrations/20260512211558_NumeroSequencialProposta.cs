using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Emprely.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class NumeroSequencialProposta : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Numero",
                table: "propostas",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.Sql(
                """
                UPDATE "propostas"
                SET "Numero" = sequencia."Numero"
                FROM (
                    SELECT
                        "Id",
                        ROW_NUMBER() OVER (
                            PARTITION BY "ContaId"
                            ORDER BY "CreatedAt", "Id"
                        )::integer AS "Numero"
                    FROM "propostas"
                ) AS sequencia
                WHERE "propostas"."Id" = sequencia."Id";
                """);

            migrationBuilder.Sql(
                """ALTER TABLE "propostas" ALTER COLUMN "Numero" DROP DEFAULT;""");

            migrationBuilder.CreateIndex(
                name: "IX_propostas_ContaId_Numero",
                table: "propostas",
                columns: new[] { "ContaId", "Numero" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_propostas_ContaId_Numero",
                table: "propostas");

            migrationBuilder.DropColumn(
                name: "Numero",
                table: "propostas");
        }
    }
}
