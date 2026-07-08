using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Emprely.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AsaasBillingCompleto : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "assinaturas_conta",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ContaId = table.Column<Guid>(type: "uuid", nullable: false),
                    PlanoCodigo = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    Provedor = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    ProviderCustomerId = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: true),
                    ProviderSubscriptionId = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: true),
                    Status = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    MetodoPagamento = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    Valor = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    Moeda = table.Column<string>(type: "character varying(3)", maxLength: 3, nullable: false),
                    PeriodoAtualInicio = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    PeriodoAtualFim = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    CancelAtPeriodEnd = table.Column<bool>(type: "boolean", nullable: false),
                    CanceladaAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    MotivoCancelamento = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    UltimoPagamentoId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_assinaturas_conta", x => x.Id);
                    table.ForeignKey(
                        name: "FK_assinaturas_conta_contas_ContaId",
                        column: x => x.ContaId,
                        principalTable: "contas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "eventos_webhook_pagamento",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Provedor = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    ProviderEventId = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    TipoEvento = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    ProviderResourceId = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: true),
                    ContaId = table.Column<Guid>(type: "uuid", nullable: true),
                    PagamentoContaId = table.Column<Guid>(type: "uuid", nullable: true),
                    AssinaturaContaId = table.Column<Guid>(type: "uuid", nullable: true),
                    RecebidoAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    ProcessadoAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    StatusProcessamento = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    PayloadJson = table.Column<string>(type: "text", nullable: false),
                    ErroProcessamento = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_eventos_webhook_pagamento", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "historicos_assinatura_conta",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ContaId = table.Column<Guid>(type: "uuid", nullable: false),
                    AssinaturaContaId = table.Column<Guid>(type: "uuid", nullable: true),
                    PagamentoContaId = table.Column<Guid>(type: "uuid", nullable: true),
                    Evento = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    Detalhes = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_historicos_assinatura_conta", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "pagamentos_conta",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ContaId = table.Column<Guid>(type: "uuid", nullable: false),
                    AssinaturaContaId = table.Column<Guid>(type: "uuid", nullable: false),
                    PlanoCodigo = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    Provedor = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    ProviderPaymentId = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: true),
                    ProviderCheckoutId = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: true),
                    ProviderSubscriptionId = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: true),
                    ExternalReference = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: true),
                    Status = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    MetodoPagamento = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    Valor = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    Moeda = table.Column<string>(type: "character varying(3)", maxLength: 3, nullable: false),
                    DueDate = table.Column<DateOnly>(type: "date", nullable: true),
                    ConfirmedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    PaidAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    OverdueAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    RefundedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    RefundedAmount = table.Column<decimal>(type: "numeric", nullable: true),
                    InvoiceUrl = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    PixQrCodePayload = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_pagamentos_conta", x => x.Id);
                    table.ForeignKey(
                        name: "FK_pagamentos_conta_assinaturas_conta_AssinaturaContaId",
                        column: x => x.AssinaturaContaId,
                        principalTable: "assinaturas_conta",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_pagamentos_conta_contas_ContaId",
                        column: x => x.ContaId,
                        principalTable: "contas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_assinaturas_conta_ContaId",
                table: "assinaturas_conta",
                column: "ContaId");

            migrationBuilder.CreateIndex(
                name: "IX_assinaturas_conta_ProviderSubscriptionId",
                table: "assinaturas_conta",
                column: "ProviderSubscriptionId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_eventos_webhook_pagamento_Provedor_ProviderEventId",
                table: "eventos_webhook_pagamento",
                columns: new[] { "Provedor", "ProviderEventId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_eventos_webhook_pagamento_ProviderResourceId",
                table: "eventos_webhook_pagamento",
                column: "ProviderResourceId");

            migrationBuilder.CreateIndex(
                name: "IX_historicos_assinatura_conta_AssinaturaContaId",
                table: "historicos_assinatura_conta",
                column: "AssinaturaContaId");

            migrationBuilder.CreateIndex(
                name: "IX_historicos_assinatura_conta_ContaId",
                table: "historicos_assinatura_conta",
                column: "ContaId");

            migrationBuilder.CreateIndex(
                name: "IX_historicos_assinatura_conta_CreatedAt",
                table: "historicos_assinatura_conta",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_historicos_assinatura_conta_PagamentoContaId",
                table: "historicos_assinatura_conta",
                column: "PagamentoContaId");

            migrationBuilder.CreateIndex(
                name: "IX_pagamentos_conta_AssinaturaContaId",
                table: "pagamentos_conta",
                column: "AssinaturaContaId");

            migrationBuilder.CreateIndex(
                name: "IX_pagamentos_conta_ContaId",
                table: "pagamentos_conta",
                column: "ContaId");

            migrationBuilder.CreateIndex(
                name: "IX_pagamentos_conta_ProviderPaymentId",
                table: "pagamentos_conta",
                column: "ProviderPaymentId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "eventos_webhook_pagamento");

            migrationBuilder.DropTable(
                name: "historicos_assinatura_conta");

            migrationBuilder.DropTable(
                name: "pagamentos_conta");

            migrationBuilder.DropTable(
                name: "assinaturas_conta");
        }
    }
}
