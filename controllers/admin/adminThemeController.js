const Validator = require('fastest-validator');
var format = require('date-format');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Models = require('../../models');


async function adminThemeList(req, res) {

    const alltheme = await Models.Theme.findAll({});
    if (alltheme) {
        return res.render('admin/pages/Theme/themelist', {
            page_name: 'admin-theme',
            layout: 'admin/layouts/adminlayout',
            data: alltheme,
        });
    }

}

async function adminAddTheme(req, res) {
    const allCategory = await Models.Category.findAll({});
    return res.render('admin/pages/Theme/addtheme', {
        page_name: 'admin-theme',
        layout: 'admin/layouts/adminlayout',
        data:allCategory
    });
}

async function adminAddThemeAction(req, res) {
    
        var uniqueCode = 'XIGWISH' + new Date().getTime();
        if (req.files && req.files.theme) {
            //if (req.files) {
            console.log('img', req.files.theme)
            var documentFile = req.files.theme;
            var imgString = documentFile.name;
            var imgArr = imgString.split(".");
            var imgname = "theme-" + Date.now() + "." + imgArr[1];
            // theme = imgname;
            documentFile.mv("public/uploads/themes/birthday/" + imgname, function (err) {
                if (err) {
                    req.flash('error', 'Image not uploaded');
                    res.redirect('/theme-list/add');
                }
            });

            ///
            let themeData = {
                uniqueCode: uniqueCode,
                categoryId: req.body.event,
                subcategoryId: req.body.sub_category,
                name: imgname,
            };

            var created_theme = await Models.Theme.create(themeData);
            if (created_theme) {
                req.flash('success', 'Theme added successfully');
                return res.redirect('/admin/theme/add');
            } else {
                req.flash('error', 'Theme is not added ');
                return res.redirect('/admin/theme/add');
            }

        }
        //end image upload//

}

////ajax//////
async function getSubcategoryBycategoryAjax(req, res){

    let category_id = req.body.cat_id;

    const allsubcatdata = await Models.Subcategory.findAll({
        where: { categoryId: category_id }
    });
    console.log('hhhhh',allsubcatdata);
    

   return res.json({
        msg: 'success',
        subcat: allsubcatdata
        });
}

module.exports = {
    adminThemeList: adminThemeList,
    adminAddTheme: adminAddTheme,
    adminAddThemeAction: adminAddThemeAction,
    getSubcategoryBycategoryAjax: getSubcategoryBycategoryAjax
};