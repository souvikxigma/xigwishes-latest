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

async function adminEventEdit(req, res) {
    var id = req.params.id;  
    var category = await Models.Category.findOne({ where: { id: id } });
    if (category) {
        return res.render('admin/pages/Events/editevent', {
            page_name: 'admin-event',
            layout: 'admin/layouts/adminlayout',
            data:category
        });
    } else {
      req.flash('error', 'Event not found ');
      return res.redirect(`/admin/event`);
    }
  }

  async function adminEventEditAction(req, res) { 
    var id = req.params.id;
    let eventData = {
        name: req.body.event,
    };

    var update_event = await Models.Category.update(eventData,{ where: { id: id } });
    if (update_event) {
        req.flash('success', 'Event updated successfully');
        return res.redirect(`/admin/event/edit/${id}`);
    } else {
        req.flash('error', 'Event is not updated');
        return res.redirect(`/admin/event/edit/${id}`);
    }

}

async function adminEventDelete(req, res) {
    var id = req.params.id;  
    var delete_category = await Models.Category.destroy({ where: { id: id } });
    if (delete_category) {
      req.flash('success', 'Event deleted successfully');
      return res.redirect(`/admin/event`);
    } else {
      req.flash('error', 'Event is not deleted ');
      return res.redirect(`/admin/event`);
    }
  }

  
async function adminEventFestivalList(req, res) {
    var catId = req.params.id;
    const all_event_festival = await Models.Festivalsubcategory.findAll({where:{catId:catId}});
    if (all_event_festival) {
        return res.render('admin/pages/Events/alleventfestival', {
            page_name: 'admin-event',
            layout: 'admin/layouts/adminlayout',
            data: all_event_festival,
        });
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


async function adminEventFestivalEdit(req, res) {
    var catId = req.params.cid;  
    var id = req.params.id;  
    var Festivalsubcategory = await Models.Festivalsubcategory.findOne({ where: { catId: catId,id:id } });
    if (Festivalsubcategory) {
        return res.render('admin/pages/Events/editeventfestival', {
            page_name: 'admin-event',
            layout: 'admin/layouts/adminlayout',
            data:Festivalsubcategory
        });
    } else {
      req.flash('error', 'Event not found ');
      return res.redirect(`/admin/event`);
    }
  }

  async function adminEventFestivalEditAction(req, res) { 
    var id = req.params.id;
    var catId = req.params.cid;
    let eventFestivalData = {
        festivalName: req.body.festivalName,
    };
    var update_Festivalsubcategory = await Models.Festivalsubcategory.update(eventFestivalData,{ where: { id: id,catId:catId } });
    if (update_Festivalsubcategory) {
        req.flash('success', 'Event Festival updated successfully');
        return res.redirect(`/admin/event/festival/edit/${catId}/${id}`);
    } else {
        req.flash('error', 'Event Festival is not updated');
        return res.redirect(`/admin/event/festival/edit/${catId}/${id}`);
    }

}

async function adminEventFestivalDelete(req, res) {
    var id = req.params.id;  
    var catId = req.params.cid;
    var delete_Festivalsubcategory = await Models.Festivalsubcategory.destroy({ where: { id: id,catId:catId } });
    if (delete_Festivalsubcategory) {
      req.flash('success', 'Event Festival deleted successfully');
      return res.redirect(`/admin/event/festival/${catId}`);
    } else {
      req.flash('error', 'Event Festival is not deleted ');
      return res.redirect(`/admin/event/festival/${catId}`);
    }
  }



module.exports = {
    adminEventList: adminEventList,
    adminAddEvent: adminAddEvent,
    adminEventEdit:adminEventEdit,
    adminEventEditAction:adminEventEditAction,
    adminAddEventAction: adminAddEventAction,
    adminEventDelete:adminEventDelete,
    adminEventFestivalList:adminEventFestivalList,
    adminAddFestivalEvent:adminAddFestivalEvent,
    adminAddFestivalEventAction: adminAddFestivalEventAction,
    adminEventFestivalEdit:adminEventFestivalEdit,
    adminEventFestivalEditAction:adminEventFestivalEditAction,
    adminEventFestivalDelete:adminEventFestivalDelete
};