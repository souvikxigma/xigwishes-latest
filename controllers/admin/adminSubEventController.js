const Validator = require('fastest-validator');
var format = require('date-format');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Models = require('../../models');


async function adminSubEventList(req, res) {
    const allSubCategory = await Models.Subcategory.findAll({
        include:[{
            model: Models.Category,
            attributes: ["name"],
          }]
    });
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
    if (req.files && req.files.subcategory_icon && req.files.subcategory_screenshot) {
        //if (req.files) {
        //console.log('img', req.files.subcategory_icon)
        var documentFile = req.files.subcategory_icon;
        var documentScreenShot = req.files.subcategory_screenshot;

        var imgString = documentFile.name;
        var imgArr = imgString.split(".");
        var imgname ="subcategory-sample-" + Date.now() + "." + imgArr[1];

        var imgString2 = documentScreenShot.name;
        var imgArr2 = imgString2.split(".");
        var imgname2 ="subcategory-sample-screenshot-" + Date.now() + "." + imgArr2[1];

        // theme = imgname;
        documentFile.mv("public/uploads/sample/" + imgname, function (err) {
            if (err) {
                req.flash('error', 'Image not uploaded');
                res.redirect('/admin/sub-event/add');
            }
        });
        documentScreenShot.mv("public/uploads/sample/screenshot/" + imgname2, function (err) {
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
            subcategoryImageScreenShot: imgname2,
            subcategoryCss: req.body.subcategoryCss,
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



async function adminSubEventEdit(req, res) {
    const categories = await Models.Category.findAll({});
    var id = req.params.id;  
    var subcategory = await Models.Subcategory.findOne({ where: { id: id } });
    if (subcategory) {
        return res.render('admin/pages/Subevents/editsubevent', {
            page_name: 'admin-sub-event',
            layout: 'admin/layouts/adminlayout',
            data:categories,
            subcategory:subcategory
        });
    } else {
      req.flash('error', 'Sub Event not found ');
      return res.redirect(`/admin/sub-event`);
    }

  }

  async function adminSubEventEditAction(req, res) { 
    var id = req.params.id;
    var categoryId = req.params.cid;
    var imgname =null;
    var imgname2 =null;
    var subCategoryData;
    var subcategory = await Models.Subcategory.findOne({ where: { id: id } });
    if(subcategory){
        if (req.files && req.files.subcategory_icon) {
            //if (req.files) {
            //console.log('img', req.files.subcategory_icon)
            var documentFile = req.files.subcategory_icon;
            var imgString = documentFile.name;
            var imgArr = imgString.split(".");
            imgname ="subcategory-sample-" + Date.now() + "." + imgArr[1];
            // theme = imgname;
            documentFile.mv("public/uploads/sample/" + imgname, function (err) {
                if (err) {
                    req.flash('error', 'Image not uploaded');
                    res.redirect(`/admin/sub-event/edit/${categoryId}`);
                }
            });
            console.log(imgname)
        }
        if (req.files && req.files.subcategory_screenshot) {
            //if (req.files) {
            //console.log('img', req.files.subcategory_icon)
            var documentFileScreenshot = req.files.subcategory_screenshot;
            var imgString2 = documentFileScreenshot.name;
            var imgArr2 = imgString2.split(".");
            imgname2 ="subcategory-sample-screenshot-" + Date.now() + "." + imgArr2[1];
            // theme = imgname;
            documentFileScreenshot.mv("public/uploads/sample/screenshot/" + imgname2, function (err) {
                if (err) {
                    req.flash('error', 'Image not uploaded');
                    res.redirect(`/admin/sub-event/edit/${categoryId}`);
                }
            });
            console.log(imgname2)
        }
        subCategoryData = {
            categoryId: req.body.event,
            subcategoryTitle: req.body.subcategoryTitle,
            festivalSubCategoryId: req.body.festival_sub_category ? req.body.festival_sub_category:null,
            subcategoryImage: imgname ? imgname : subcategory.subcategoryImage,
            subcategoryImageScreenShot: imgname2 ? imgname2 : subcategory.subcategoryImageScreenShot,
            subcategoryCss: req.body.subcategoryCss,
        };
    
    
        var update_Subcategory = await Models.Subcategory.update(subCategoryData,{ where: { categoryId:categoryId,id: id } });
        if (update_Subcategory) {
            req.flash('success', 'Sub Category updated successfully');
            return res.redirect(`/admin/sub-event/edit/${categoryId}`);
        } else {
            req.flash('error', 'Sub Category is not updated');
            return res.redirect(`/admin/sub-event/edit/${categoryId}`);
        }
    } else {
        req.flash('error', 'Sub Category not found');
        return res.redirect(`/admin/sub-event/edit/${categoryId}`);
    }
    

}

async function adminSubEventDelete(req, res) {
    var id = req.params.id;  
    var delete_Subcategory = await Models.Subcategory.destroy({ where: { id: id } });
    if (delete_Subcategory) {
      req.flash('success', 'Sub Category deleted successfully');
      return res.redirect(`/admin/sub-event`);
    } else {
      req.flash('error', 'Sub Category is not deleted ');
      return res.redirect(`/admin/sub-event`);
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
    adminSubEventEdit:adminSubEventEdit,
    adminSubEventEditAction:adminSubEventEditAction,
    adminSubEventDelete:adminSubEventDelete,
    adminGetSubFestivalCategoryAjax: adminGetSubFestivalCategoryAjax,
};