
    (function() {
      
      function isAndroid() {
        //This will only work on SDK 5.2+
        return typeof(localytics.promptForLocationAlwaysPermissions) === "undefined";
      }

      function notificationPrompt(ampAction) {
        if (!isAndroid()) {
          localytics.promptForNotificationPermissions(ampAction);
        }
      }
      
      function locationPrompt(ampAction) {
        if (isAndroid()) {
          localytics.promptForLocationPermissions(ampAction);
        } else {
          if (localytics.locationAuthorizationStatus === 0) {
            //If permissions are unknown
            localytics.promptForLocationWhenInUsePermissions(ampAction);
          } else if (localytics.locationAuthorizationStatus === 4) {
            //If permissions are WhenInUse
            localytics.promptForLocationAlwaysPermissions(ampAction);
          }
        }
      }

      function attachDeeplinkCTAs() {
        var ctas = document.querySelectorAll('[data-cta-url]');
        for(var i = 0; i < ctas.length; i++) {
          (function() {
            var url = ctas[i].attributes['data-cta-url'].value;
            var ampActionElement = ctas[i].attributes['data-cta-action'];
            var ampAction = ampActionElement ? ampActionElement.value : '';
            ctas[i].addEventListener('click', function() {
              if (url.indexOf("ll_notification_prompt") != -1) {
                notificationPrompt(ampAction);
              } else if (url.indexOf("ll_location_prompt") != -1) {
                locationPrompt(ampAction);
              } else if (url.indexOf("ll_close") != -1) {
                localytics.close();
              } else if (url.indexOf("ll_settings") != -1){
                localytics.deeplinkToSettings();
              } else {
                window.open(url);
                localytics.close();
              }
            });
          })()
        }
      }
    // Scripts placed here will only be executed following download
    })();
  