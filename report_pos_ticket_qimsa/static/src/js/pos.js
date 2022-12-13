odoo.define('report_pos_ticket_qimsa.pos', function (require) {
    "use strict";

    var models = require('point_of_sale.models');
    var session = require('web.session');

    models.load_fields("res.company", "l10n_mx_edi_fiscal_regime");

    models.load_models([
        {   // Load the values of picking_type_id
            model:  'stock.picking.type',
            fields: ['warehouse_id'],
            ids: function(){
                return [posmodel.config.picking_type_id[0]];
            },
            loaded: function(self, picking_types){
                self.picking_type = picking_types[0];
            },
        },
        {   // Load the values of warehouse_id
            model: 'stock.warehouse',
            fields: ['partner_id'],
            ids: function(){
                return [posmodel.picking_type.warehouse_id[0]];
            },
            loaded: function(self, warehouses){
                self.warehouse = warehouses[0];
            },
        },
        {   // Load the values of warehouse_partner
            model:  'res.partner',
            label: 'warehouse_partner',
            fields: ['name','street','city','state_id','country_id','vat','zip'],
            ids: function(){
                return [posmodel.warehouse.partner_id[0]];
            },
            loaded: function(self, partners){
                self.warehouse_partner = partners[0];
            },
        },
        {   // Load the values of l10n_mx_edi_fiscal_regime
            label:  'fiscal_regimes',
            loaded: function(self){
                return session.rpc('/web/dataset/call_kw',{
                    args: [], model: "res.company",
                    method: "fields_get", kwargs: {}
                }).then(function(fields) {
                    self.fiscal_regimes = fields.l10n_mx_edi_fiscal_regime.selection;
                    self.fiscal_regimes_by_id = {};
                    _.each(self.fiscal_regimes, function(regime){
                        self.fiscal_regimes_by_id[regime[0]] = regime[1];
                    });
                });
            },
        }
    ]);

    var order_model_super = models.Order.prototype;
    models.Order = models.Order.extend({
        export_for_printing: function () {
            var receipt = order_model_super.export_for_printing.bind(this)();

            receipt = _.extend(receipt, {
                'company': _.extend(receipt.company, {
                    'l10n_mx_edi_fiscal_regime': this.pos.company.l10n_mx_edi_fiscal_regime
                }),
                'warehouse_partner': {
                    'name': this.pos.warehouse_partner.name,
                    'street': this.pos.warehouse_partner.street,
                    'city': this.pos.warehouse_partner.city,
                    'state_id': this.pos.warehouse_partner.state_id[1],
                    'country_id': this.pos.warehouse_partner.country_id[1],
                    'zip': this.pos.warehouse_partner.zip,
                },
            });
            return receipt;
        },

    });

});
