const Validator = require('fastest-validator');
var format = require('date-format');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Models = require('../../models');


async function adminSubEventList(req, res) {
    // Models.Category.findAll({
    //     attributes: ["name", "icon"],
    //     include: [{
    //         model: Product,
    //         as: "hasManyProducts",
    //         attributes: ["name"]
    //     }]
    // })
    const allSubCategory = await Models.Subcategory.findAll({
        include:[{
            model: Models.Category,
            attributes: ["name"],
          }]
    });
    //console.log(allSubCategory)
    if (allSubCategory) {
        return res.render('admin/pages/Subevents/allsubevent', {
            page_name: 'admin-sub-event',
            layout: 'admin/layouts/adminlayout',
            data: allSubCategory,
        });
    }
}

async function adminSubAddEvent(req, res) {
    const Caategory = await Models.Category.findAll({});
    return res.render('admin/pages/Subevents/addsubevent', {
        page_name: 'admin-sub-event',
        layout: 'admin/layouts/adminlayout',
        data:Caategory
    });
}

async function adminSubAddEventAction(req, res) {
    
    if (req.files && req.files.subcategory_icon) {
        //if (req.files) {
        //console.log('img', req.files.subcategory_icon)
        var documentFile = req.files.subcategory_icon;
        var imgString = documentFile.name;
        var imgArr = imgString.split(".");
        var imgname ="subcategory-sample-" + Date.now() + "." + imgArr[1];
        // theme = imgname;
        documentFile.mv("public/uploads/sample/" + imgname, function (err) {
            if (err) {
                req.flash('error', 'Image not uploaded');
                res.redirect('/admin/sub-event/add');
            }
        });
        console.log(imgname)
        //var uniqueCode = 'XIGWISHSUBEVENT' + new Date().getTime();
        ///
        let subCategoryData = {
            subcategoryUniqueCode: 'XIGWISHSUBEVENT' + new Date().getTime(),
            categoryId: req.body.event,
            subcategoryTitle: req.body.subcategoryTitle,
            festivalSubCategoryId: req.body.festival_sub_category ? req.body.festival_sub_category:null,
            subcategoryImage: imgname,
        };

        var created_subcategory = await Models.Subcategory.create(subCategoryData);
        if (created_subcategory) {
            req.flash('success', 'Sub Event added successfully');
            return res.redirect('/admin/sub-event/add');
        } else {
            req.flash('error', 'Sub Event is not added ');
            return res.redirect('/admin/sub-event/add');
        }

    }

}

////ajax/////
async function adminGetSubFestivalCategoryAjax(req,res){
    const allfestivalsubcatdata = await Models.Festivalsubcategory.findAll({});
    return res.json({
        msg: 'success',
        subcat: allfestivalsubcatdata
    });
}





module.exports = {
    adminSubEventList: adminSubEventList,
    adminSubAddEvent: adminSubAddEvent,
    adminSubAddEventAction: adminSubAddEventAction,
    adminGetSubFestivalCategoryAjax: adminGetSubFestivalCategoryAjax,
};