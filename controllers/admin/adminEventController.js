const Validator = require('fastest-validator');
var format = require('date-format');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Models = require('../../models');


async function adminEventList(req, res) {

    const allCategory = await Models.Category.findAll({});
    if (allCategory) {
        return res.render('admin/pages/Events/allevent', {
            page_name: 'admin-event',
            layout: 'admin/layouts/adminlayout',
            data: allCategory,
        });
    }

}

function adminAddEvent(req, res) {
    return res.render('admin/pages/Events/addevent', {
        page_name: 'admin-event',
        layout: 'admin/layouts/adminlayout'
    });
}

async function adminAddEventAction(req, res) { 
    let eventData = {
        name: req.body.event,
    };

    var created_event = await Models.Category.create(eventData);
    if (created_event) {
        req.flash('success', 'Event added successfully');
        return res.redirect('/admin/event/add');
    } else {
        req.flash('error', 'Event is not added ');
        return res.redirect('/admin/event/add');
    }

}


function adminAddFestivalEvent(req, res) {
    return res.render('admin/pages/Events/addfestivalevent', {
        page_name: 'admin-event',
        layout: 'admin/layouts/adminlayout'
    });
}


async function adminAddFestivalEventAction(req, res) { 
    let eventData = {
        festivalName: req.body.festevent,
    };
    var created_event = await Models.Festivalsubcategory.create(eventData);
    if (created_event) {
        req.flash('success', 'Festival Name added successfully');
        return res.redirect('/admin/event/add-festival-name');
    } else {
        req.flash('error', 'Festival Name is not added ');
        return res.redirect('/admin/event/add-festival-name');
    }
}

module.exports = {
    adminEventList: adminEventList,
    adminAddEvent: adminAddEvent,
    adminAddEventAction: adminAddEventAction,
    adminAddFestivalEvent:adminAddFestivalEvent,
    adminAddFestivalEventAction: adminAddFestivalEventAction,
};