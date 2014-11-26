'use strict';

(function() {

  var app = angular.module('plugin.translations', []);

  // Define event handler functions for later invocation by UI plugin infrastructure
  app.factory('translationService', ['english', 'chinese', function (english, chinese) {
    return {
      getTranslation: function ($scope, langKey) {
        switch (langKey) {

          case ('zh'):
            $scope.trans = chinese;
            break;

          default:
            $scope.trans = english;
        }
      }
    }
  }]);

  app.value('english',
    {
        "TAB_NAME" : "Domains",

        "PROCESSING" : "Processing...",

        // Menu
        "BTN_ADD_LABEL" : "Add",
        "BTN_REFRESH_LABEL" : "Refresh",

        // Table
        "TABLE_DOMAIN_LABEL" : "Domain",
        "TABLE_USERNAME_LABEL" : "Username",
        "TABLE_ACTIONS_LABEL" : "Actions",
        "TABLE_NO_DOMAINS" : "No domain to display.",
        "TABLE_BTN_EDIT_LABEL" : "Edit",
        "TABLE_BTN_REMOVE_LABEL" : "Delete",

        // Notification Messages
        "NOTIFICATION_WELCOME" : "Thanks for using this plugin. All the code is on <a href=\"https://github.com/eayun/UIPlugin-Engine-Manage-Domains\"> GitHub</a>. If you have any suggestion please <a href=\"https://github.com/eayun/UIPlugin-Engine-Manage-Domains/issues\">open an issue on GitHub</a>.",
        "NOTIFICATION_NEED_RESTART" : "oVirt Engine restart is required in order for the changes to take place (service ovirt-engine restart).",
        "NOTIFICATION_REMOVE_USERS" : "Please remove all users and groups of this domain using the Administration portal or the API.",

        "NOTIFICATION_REFRESH_FAILED" : "Impossible to refresh the list of Domains.",
        "NOTIFICATION_REFRESH_SUCCESS" : "The list of Domains has been refreshed successfully.",

        "NOTIFICATION_DELETE_SUCCESS_1" : "<strong>",
        "NOTIFICATION_DELETE_SUCCESS_2" : "</strong> has been successfully deleted.",
        "NOTIFICATION_DELETE_FAILED_1" : "Impossible to delete the domain <strong>",
        "NOTIFICATION_DELETE_FAILED_2" : "</strong>.",

        "NOTIFICATION_ADD_SUCCESS_1" : "The domain <strong>",
        "NOTIFICATION_ADD_SUCCESS_2" : "</strong> has been added successfully.",
        "NOTIFICATION_ADD_FAILED_1" : "Impossible to add the domain <strong>",
        "NOTIFICATION_ADD_FAILED_2" : "</strong>.",

        "NOTIFICATION_EDIT_SUCCESS_1" : "The domain <strong>",
        "NOTIFICATION_EDIT_SUCCESS_2" : "</strong> has been edited successfully.",
        "NOTIFICATION_EDIT_FAILED_1" : "Impossible to edit the domain <strong>",
        "NOTIFICATION_EDIT_FAILED_2" : "</strong>.",


        // Add Dialog
        "DIALOG_ADD_TITLE" : "Add Domain",
        "DIALOG_ADD_FORM_DOMAIN" : "Domain",
        "DIALOG_ADD_FORM_DOMAIN_HELP" : "The domain you want to add.",
        "DIALOG_ADD_FORM_PROVIDER" : "Provider",
        "DIALOG_ADD_FORM_PROVIDER_HELP" : "The LDAP provider type of server used for the domain.",
        "DIALOG_ADD_FORM_USER" : "User",
        "DIALOG_ADD_FORM_USER_HELP" : "The domain user.",
        "DIALOG_ADD_FORM_PASSWORD" : "Password",
        "DIALOG_ADD_FORM_PASSWORD_HELP" : "If you want to use a file containing the password use the Advanced Parameters.",
        "DIALOG_ADD_FORM_PASSWORD_SHOW" : "Show password",
        "DIALOG_ADD_FORM_ADVANCED_PARAM" : "Advanced Parameters",
        "DIALOG_ADD_FORM_ADDPERMISSION" : "Add Permission",
        "DIALOG_ADD_FORM_ADDPERMISSION_HELP" : "Add engine superuser permissions to the user.",
        "DIALOG_ADD_FORM_CONFIGFILE" : "Config File",
        "DIALOG_ADD_FORM_CONFIGFILE_HELP" : "Use the given alternate configuration file. [Use the absolute path of the file on the machine]",
        "DIALOG_ADD_FORM_LDAPSERVERS" : "LDAP Servers",
        "DIALOG_ADD_FORM_LDAPSERVERS_HELP" : "A comma delimited list of LDAP servers to be set to the domain.",
        "DIALOG_ADD_FORM_RESOLVEKDC" : "Resolve KDC",
        "DIALOG_ADD_FORM_RESOLVEKDC_HELP" : "Resolve KDC servers using DNS (don't assume they are the same as LDAP servers).",
        "DIALOG_ADD_FORM_PASSWORDFILE" : "Password File",
        "DIALOG_ADD_FORM_PASSWORDFILE_HELP" : "A file containing the password. [Use the absolute path of the file on the machine]",
        "DIALOG_ADD_FORM_ERROR_MSG" : "Domain, Provider, User and PasswordFile are requiered input. Please fill them correctly !",

        // Edit Dialog
        "DIALOG_EDIT_TITLE" : "Edit ",
        "DIALOG_EDIT_HELP_1" : "To edit ",
        "DIALOG_EDIT_HELP_2" : " please fill only the fields you want to modify.",
        "DIALOG_EDIT_FORM_PROVIDER" : "Provider",
        "DIALOG_EDIT_FORM_PROVIDER_HELP" : "The LDAP provider type of server used for the domain.",
        "DIALOG_EDIT_FORM_USER" : "User",
        "DIALOG_EDIT_FORM_USER_HELP" : "The domain user.",
        "DIALOG_EDIT_FORM_PASSWORD" : "Password",
        "DIALOG_EDIT_FORM_PASSWORD_HELP" : "If you want to use a file containing the password use the Advanced Parameters.",
        "DIALOG_EDIT_FORM_PASSWORD_SHOW" : "Show password",
        "DIALOG_EDIT_FORM_ADDPERMISSION" : "Add Permission",
        "DIALOG_EDIT_FORM_ADDPERMISSION_HELP" : "Add engine superuser permissions to the user.",
        "DIALOG_EDIT_FORM_CONFIGFILE" : "Config File",
        "DIALOG_EDIT_FORM_CONFIGFILE_HELP" : "Use the given alternate configuration file. [Use the absolute path of the file on the machine]",
        "DIALOG_EDIT_FORM_LDAPSERVERS" : "LDAP Servers",
        "DIALOG_EDIT_FORM_LDAPSERVERS_HELP" : "A comma delimited list of LDAP servers to be set to the domain.",
        "DIALOG_EDIT_FORM_RESOLVEKDC" : "Resolve KDC",
        "DIALOG_EDIT_FORM_RESOLVEKDC_HELP" : "Resolve KDC servers using DNS (don't assume they are the same as LDAP servers).",
        "DIALOG_EDIT_FORM_PASSWORDFILE" : "Password File",
        "DIALOG_EDIT_FORM_PASSWORDFILE_HELP" : "A file containing the password. [Use the absolute path of the file on the machine]",
        "DIALOG_EDIT_FORM_ERROR_MSG" : "Your form is not correct ! Please precise a valid absolute path to the file containing the password.",

        // Delete Dialog
        "DIALOG_DELETE_HELP_1" : "Are you sure you want to delete the domain ",
        "DIALOG_DELETE_HELP_2" : " ?"
    }
  );

  app.value('chinese',
    {
        "TAB_NAME" : "域名",

        "PROCESSING" : "处理...",

        // Menu
        "BTN_ADD_LABEL" : "添加",
        "BTN_REFRESH_LABEL" : "刷新",

        // Table
        "TABLE_DOMAIN_LABEL" : "域",
        "TABLE_USERNAME_LABEL" : "用户名",
        "TABLE_ACTIONS_LABEL" : "行动",
        "TABLE_NO_DOMAINS" : "无域显示。",
        "TABLE_BTN_EDIT_LABEL" : "编辑",
        "TABLE_BTN_REMOVE_LABEL" : "删除",

        // Notification Messages
        "NOTIFICATION_WELCOME" : "感谢您使用这个插件。所有的代码是在<a href=\"https://github.com/eayun/UIPlugin-Engine-Manage-Domains\">GitHub</a>上。如果您有任何建议，请在<a href=\"https://github.com/eayun/UIPlugin-Engine-Manage-Domains/issues\">GitHub上提一个issue</a>。",
        "NOTIFICATION_NEED_RESTART" : "oVirt引擎需要重新启动，以更修改生效（service ovirt-engine restart）。",
        "NOTIFICATION_REMOVE_USERS" : "请删除所有使用了管理门户或API的域的用户和组。",

        "NOTIFICATION_REFRESH_FAILED" : "无法刷新域的列表。",
        "NOTIFICATION_REFRESH_SUCCESS" : "域名列表中已成功刷新。",

        "NOTIFICATION_DELETE_SUCCESS_1" : "<strong>",
        "NOTIFICATION_DELETE_SUCCESS_2" : "</strong>已成功删除。",
        "NOTIFICATION_DELETE_FAILED_1" : "无法删除域<strong>",
        "NOTIFICATION_DELETE_FAILED_2" : "</strong>。",

        "NOTIFICATION_ADD_SUCCESS_1" : "域<strong>",
        "NOTIFICATION_ADD_SUCCESS_2" : "</strong>已成功添加。",
        "NOTIFICATION_ADD_FAILED_1" : "无法添加域<strong>",
        "NOTIFICATION_ADD_FAILED_2" : "</strong>。",

        "NOTIFICATION_EDIT_SUCCESS_1" : "域<strong>",
        "NOTIFICATION_EDIT_SUCCESS_2" : "</strong>已成功编辑。",
        "NOTIFICATION_EDIT_FAILED_1" : "无法编辑域<strong>",
        "NOTIFICATION_EDIT_FAILED_2" : "</strong>。",


        // Add Dialog
        "DIALOG_ADD_TITLE" : "添加域",
        "DIALOG_ADD_FORM_DOMAIN" : "域",
        "DIALOG_ADD_FORM_DOMAIN_HELP" : "您想要添加的域。",
        "DIALOG_ADD_FORM_PROVIDER" : "提供商",
        "DIALOG_ADD_FORM_PROVIDER_HELP" : "域所使用的域服务器的LDAP提供程序类型。",
        "DIALOG_ADD_FORM_USER" : "用户",
        "DIALOG_ADD_FORM_USER_HELP" : "域用户。",
        "DIALOG_ADD_FORM_PASSWORD" : "密码",
        "DIALOG_ADD_FORM_PASSWORD_HELP" : "如果您想要使用一个包含密码的文件，请使用高级的参数",
        "DIALOG_ADD_FORM_PASSWORD_SHOW" : "显示密码",
        "DIALOG_ADD_FORM_ADVANCED_PARAM" : "高级参数",
        "DIALOG_ADD_FORM_ADDPERMISSION" : "添加权限",
        "DIALOG_ADD_FORM_ADDPERMISSION_HELP" : "为用户添加engine超级用户权限。",
        "DIALOG_ADD_FORM_CONFIGFILE" : "配置文件",
        "DIALOG_ADD_FORM_CONFIGFILE_HELP" : "使用给定的备用配置文件。 [使用本机上的文件的绝对路径]",
        "DIALOG_ADD_FORM_LDAPSERVERS" : "LDAP服务器",
        "DIALOG_ADD_FORM_LDAPSERVERS_HELP" : "LDAP服务器的逗号分隔的列表中设置的域。",
        "DIALOG_ADD_FORM_RESOLVEKDC" : "解析KDC",
        "DIALOG_ADD_FORM_RESOLVEKDC_HELP" : "使用DNS解析服务器KDC（不要以为他们是一样的LDAP服务器）。",
        "DIALOG_ADD_FORM_PASSWORDFILE" : "密码文件",
        "DIALOG_ADD_FORM_PASSWORDFILE_HELP" : "包含密码的文件。 [使用本机上的文件的绝对路径]",
        "DIALOG_ADD_FORM_ERROR_MSG" : "需要输入域，供应商，用户和密码文件。请正确填写他们！",

        // Edit Dialog
        "DIALOG_EDIT_TITLE" : "Edit ",
        "DIALOG_EDIT_HELP_1" : "编辑",
        "DIALOG_EDIT_HELP_2" : "请只填写您要修改的字段。",
        "DIALOG_EDIT_FORM_PROVIDER" : "提供商",
        "DIALOG_EDIT_FORM_PROVIDER_HELP" : "域所使用的域服务器的LDAP提供程序类型。",
        "DIALOG_EDIT_FORM_USER" : "用户",
        "DIALOG_EDIT_FORM_USER_HELP" : "域用户。",
        "DIALOG_EDIT_FORM_PASSWORD" : "密码",
        "DIALOG_EDIT_FORM_PASSWORD_HELP" : "如果你想使用包含密码​​的文件请使用的高级参数。",
        "DIALOG_EDIT_FORM_PASSWORD_SHOW" : "显示密码",
        "DIALOG_EDIT_FORM_ADDPERMISSION" : "添加权限",
        "DIALOG_EDIT_FORM_ADDPERMISSION_HELP" : "为用户添加engine超级用户权限。",
        "DIALOG_EDIT_FORM_CONFIGFILE" : "配置文件",
        "DIALOG_EDIT_FORM_CONFIGFILE_HELP" : "使用给定的备用配置文件。 [使用本机上的文件的绝对路径]",
        "DIALOG_EDIT_FORM_LDAPSERVERS" : "LDAP服务器",
        "DIALOG_EDIT_FORM_LDAPSERVERS_HELP" : "LDAP服务器的逗号分隔的列表中设置的域。",
        "DIALOG_EDIT_FORM_RESOLVEKDC" : "解析KDC",
        "DIALOG_EDIT_FORM_RESOLVEKDC_HELP" : "使用DNS解析服务器KDC（不要以为他们是一样的LDAP服务器）。",
        "DIALOG_EDIT_FORM_PASSWORDFILE" : "密码文件",
        "DIALOG_EDIT_FORM_PASSWORDFILE_HELP" : "包含密码的文件。 [使用本机上的文件的绝对路径]",
        "DIALOG_EDIT_FORM_ERROR_MSG" : "您的格式不正确！请将正确的路径写到包含密码的文件中。",

        // Delete Dialog
        "DIALOG_DELETE_HELP_1" : "你确定要删除域",
        "DIALOG_DELETE_HELP_2" : "？"
    }
  );

})();
