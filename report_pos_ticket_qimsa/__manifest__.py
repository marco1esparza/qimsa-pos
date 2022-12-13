# Copyright 2022, Jarsa
# License LGPL-3.0 or later (http://www.gnu.org/licenses/lgpl.html).

{
    "name": "POS Ticket for Qimsa",
    "summary": "Customizations for report",
    "version": "13.0.1.0.0",
    "category": "Instance",
    "author": "Jarsa Sistemas",
    "website": "https://www.jarsa.com",
    "license": "LGPL-3",
    "depends": [
        "point_of_sale",
        "l10n_mx_edi",
    ],
    "data": [
        "views/pos_templates.xml",
    ],
    "qweb": [
        "static/src/xml/pos.xml",
    ],
}
