# Welcome to @intercom/messenger-js-sdk 👋

[![Version](https://img.shields.io/npm/v/@intercom/messenger-js-sdk.svg)](https://www.npmjs.com/package/@intercom/messenger-js-sdk)
[![Documentation](https://img.shields.io/badge/documentation-yes-brightgreen.svg)](https://github.com/intercom/messenger-js-sdk#readme)

> JS wrapper for easy use of our Messenger Client API on various commonly used web frameworks

### 🏠 [Website](https://intercom.com/)

### 📚 [Developer Docs](https://developers.intercom.com/installing-intercom/web/installation)

---

### 📂 [Description](https://github.com/intercom/messenger-js-sdk#readme)

- [Installation](#installation)
  - [React](#react)
  - [Angular](#angular)
  - [Vue](#vue)
  - [Ember](#ember)
- [Common methods](#methods)
  - [Types](#types)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)
- [Author](#author)
- [License](#license)

## Installation

```sh
$ npm install @intercom/messenger-js-sdk
```

or

```sh
yarn add @intercom/messenger-js-sdk
```

### React

- Import the package on every page that should display the messenger or on a common component used by them.

```javascript
import Intercom from "@intercom/messenger-js-sdk";
```

**If you have a React Remix project**, please install Intercom via the named export like this:
```javascript
import { Intercom } from "@intercom/messenger-js-sdk";
```

- Then call the imported function in the component render cycle with the correct parameters.
  **This must be done on the client's side.**

```javascript
// ...
export default MyPage = () => {
  Intercom({
    app_id: constants.intercom_app_id,
    user_id: user.id,
    name: user.name,
    email: user.email,
    created_at: user.createdAt,
  });
  // ...
};
```

The package keeps track of any instances needed internally, therefore re-renders due to DOM changes won't trigger re-boot of the messenger.

### Angular

- Import the package on every page that should display the messenger or on a common component used by them.

```javascript
import Intercom from "@intercom/messenger-js-sdk";
```

- Then call the imported function in the component render cycle with the correct parameters.

```javascript
// ...
export class MyPage {
  constructor() {
    Intercom({
      app_id: constants.intercom_app_id,
      user_id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.createdAt,
    });
  }
  // ...
}
```

The package keeps track of any instances needed internally, therefore re-renders due to DOM changes won't trigger re-boot of the messenger.

### Vue

- Simply import the package and call the function on every page that should display the messenger or on a common component used by them.

```javascript
<script setup>
import Intercom from "@intercom/messenger-js-sdk";
Intercom({
  app_id: constants.intercom_app_id,
            user_id: user.id,
            name: user.name,
            email: user.email,
            created_at: user.createdAt,
    });
</script>
```

### Ember

- Simply import the package and call the function on every page that should display the messenger or on a common component used by them.

```javascript
import Intercom from "@intercom/messenger-js-sdk";
Intercom({
  app_id: constants.intercom_app_id,
  user_id: user.id,
  name: user.name,
  email: user.email,
  created_at: user.createdAt,
});
```

- If you want the messenger on the every page, it is possible by doing this call on the Application level.

## Methods

All methods described bellow can only be called **after calling the initialization method `Intercom({...})`**.

### `show`

```JavaScript
import { show } from '@intercom/messenger-js-sdk';
// ...
show()
```

This will show the Messenger ( it is called by default after initialization). If there are no new conversations, it will open to the Messenger Home. If there are, it will open with the message list.

---

### `shutdown`

If you have the Inbox product (combined with another product like Messages) you should call the Intercom shutdown method to clear your users’ conversations anytime they logout of your application. Otherwise, the cookie we use to track who was most recently logged in on a given device or computer will keep these conversations in the Messenger for one week. This method will effectively clear out any user data that you have been passing through the JS API.

```JavaScript
import { shutdown } from '@intercom/messenger-js-sdk';
// ...
shutdown()
```

**Deleting cookies**

If you need to delete cookies created by the Messenger but are unable to use this method (e.g. because our JavaScript hasn’t been loaded), all cookies are prefixed with intercom- and are created on your domain.

### `update`

Calling the update method with some new user data will trigger the JavaScript to look for new messages that should be displayed to the current user (the one whose details are in the window.intercomSettings variable) and show them if they exist.

Calling the update method with a JSON object of user details will update those fields on the current user in addition to logging an impression at the current URL and looking for new messages for the user.

```JavaScript
import { update } from '@intercom/messenger-js-sdk';
// ...
update({"name": "Inigo Montoya"});
```

---

### `hide`

This will hide the main Messenger panel if it is open. **It will not hide the Messenger Launcher.**

```JavaScript
import { hide } from '@intercom/messenger-js-sdk';
// ...
hide();
```

---

### `show`

This will show the Messenger. If there are no new conversations, it will open to the Messenger Home. If there are, it will open with the message list.

```JavaScript
import { show } from '@intercom/messenger-js-sdk';
// ...
show();
```

---

### `showSpace`

This will show the Messenger. If there are no new conversations, it will open to the Messenger Home. If there are, it will open with the message list.

```javascript
import { showSpace } from "";
// ...
showSpace("home");
showSpace("messages");
showSpace("help");
showSpace("news");
showSpace("tasks");
showSpace("tickets"); // ...
```

---

### `showMessages`

This will open the Messenger on the message list session

```JavaScript
import { showMessages } from '@intercom/messenger-js-sdk';
// ...
showMessages();
```

---

### `showNewMessage`

This will open the Messenger as if a new conversation was just created.

This function can also take an optional second parameter, used to pre-populate the message composer as shown in the code example below:

No pre-populated message:

```JavaScript
import { showNewMessage } from '@intercom/messenger-js-sdk';
// ...
showNewMessage();
```

With pre-populated message **(only available with inbox product)** :

```JavaScript
import { showNewMessage } from '@intercom/messenger-js-sdk';
// ...
showNewMessage('pre-populated content');
```

---

### `onHide, onShow`

When we hide/show the messenger, you assign a callback hook into this event. This requires a function argument.

```javascript
import { onHide, onShow } from "@intercom/messenger-js-sdk";
// ...
onHide(myOnHideCallback);
// ...
onShow(myOnShowCallback);
```

---

### `onUnreadCountChange`

This method allows you to register a function that will be called immediately when invoked, and again whenever the current number of unread messages changes.

```javascript
import { onUnreadCountChange } from "@intercom/messenger-js-sdk";
// ...
onUnreadCountChange(function (unreadCount) {
  // Do stuff...
});
```

---

### `trackEvent`

You can submit an event using the trackEvent method. This will associate the event with the currently logged in user and send it to Intercom. The final parameter is a map that can be used to send optional metadata about the event.

You can also add custom information to events in the form of event metadata, which can be included in event based messages to your customers.

Without metadata:

```javascript
import { trackEvent } from "@intercom/messenger-js-sdk";
// ...
trackEvent("event-name");
```

With metadata:

```javascript
import { trackEvent } from "@intercom/messenger-js-sdk";
// ...
var exampleMetadata = {
  invitee_email: "pi@example.org",
  invite_code: "ADDAFRIEND",
};
// ...
trackEvent("event-name", exampleMetadata);
```

---

### `getVisitorId`

A visitor is someone who goes to your site but does not use the messenger. You can track these visitors via the visitor user_id. This user_id can be used to retrieve the visitor or lead through the REST API.

```javascript
import { getVisitorId } from "@intercom/messenger-js-sdk";

// ...
var currentVisitorID = getVisitorId();
```

---

### `startTour`

If you would like to trigger a tour based on an action a user or visitor takes in your site or application, you can use this API method. You need to call this method with the id of the tour you wish to show. The id of the tour can be found in the “Use tour everywhere” section of the tour editor.

Please note that tours shown via this API must be published and the “Use tour everywhere” section must be turned on. If you're calling this API using an invalid tour id, nothing will happen. Nothing will happen if you call this API on mobile web as tours currently do not work on mobile.

```javascript
import { startTour } from "@intercom/messenger-js-sdk";

// ...
startTour(tourId);
```

---

### `showArticle`

If you would like to trigger an article in the Messenger, you can use the showArticle method. The article will be shown within the Messenger, and clicking the Messenger back button will return to the previous context.
If the Messenger is closed when the method is called, it will be opened first and then the article will be shown.

```javascript
import { showArticle } from "@intercom/messenger-js-sdk";

// ...
showArticle(articleId);
```

---

### `showNews`

If you would like to trigger a news item in the Messenger, you can use the showNews method. The news item will be shown within the Messenger, and clicking the Messenger back button will return to the previous context.
If the Messenger is closed when the method is called, it will be opened first and then the news item will be shown.

```javascript
import { showNews } from "@intercom/messenger-js-sdk";

// ...
showNews(newsItemId);
```

---

### `startSurvey`

If you would like to trigger a survey in the Messenger, you can use the startSurvey method. The id of the survey can be found in the “Additional ways to share your survey” section of the survey editor as well as in the URL of the editor.

Please note that surveys shown via this API must be live. If you're calling this API using an invalid survey id, nothing will happen.

```javascript
import { startSurvey } from "@intercom/messenger-js-sdk";

// ...
startSurvey(surveyId);
```

---

### `startChecklist`

If you would like to trigger a checklist in the Messenger, you can use the startChecklist method. The id of the checklist can be found in the “Additional ways to share your checklist” section of the checklist editor as well as in the URL of the editor.

Please note that checklists shown via this API must be live. If you're calling this API using an invalid checklist id, nothing will happen.

```javascript
import { startChecklist } from "@intercom/messenger-js-sdk";

// ...
startChecklist(checklistId);
```

---

### `showTicket`

If you would like to trigger a ticket in the Messenger, you can use the showTicket method. The ticket will be shown within the Messenger, and clicking the Messenger back button will return to the previous context.
If the Messenger is closed when the method is called, it will be opened first and then the ticket will be shown.

```javascript
import { showTicket } from "@intercom/messenger-js-sdk";

// ...
showTicket(ticketId);
```

---

### `showConversation`

You can show a conversation programatically in the Messenger by calling showConversation method

```javascript
import { showConversation } from "@intercom/messenger-js-sdk";

// ...
showConversation(conversationId);
```

---

### `onUserEmailSupplied`

When a visitor enters their email into the Messenger, you can hook into the event. This requires a function argument.

```javascript
import { onUserEmailSupplied } from "@intercom/messenger-js-sdk";

// ...
onUserEmailSupplied(function () {
  // Do stuff...
});
```

---

### `boot`

The boot function can be used if at somepoint the [`shutdown`](#shutdown) function was called. This is also useful in situations like a one-page Javascript based application where the user may not be logged in when the page loads. You call this method with the standard intercomSettings object used for the initiate the widget.

```javascript
import { boot } from "@intercom/messenger-js-sdk";

// ...
boot({
  app_id: "abc12345",
  email: "john.doe@example.com",
  created_at: 1234567890,
  name: "John Doe",
  user_id: "9876",
});
```

---

### Attributes and objects

#### Messenger Attributes

| Attribute                                        | Type     | Description                                         |
| ------------------------------------------------ | -------- | --------------------------------------------------- |
| app_id                                           | string   | The app_id of your Intercom app which will indicate |
| custom_launcher_selectorcustom_launcher_selector | string   | The CSS selector of an element                      |
| alignment                                        | string   | Dictate the alignment of the default launcher       |
| vertical_padding                                 | integer  | Move the default launcher icon                      |
| horizontal_padding                               | integer  | Move the default launcher icon                      |
| hide_default_launcher                            | boolean  | Hide the default launcher icon.                     |
| session_duration                                 | integer  | Time in milliseconds for the Intercom               |
| action_color                                     | string\* | Used in button links and more to highlight          |
| background_color                                 | string\* | Used behind your team profile and other             |

- The color string can be any valid CSS Color Name HEX or RGB

#### Data Attributes

These attributes are used to update user/lead information.

When user_id / email is provided, it will be saved as a User record
When no user_id / email is provided, it will be considered a Visitor record which is not seen in the Intercom dashboard. When a Visitor sends a message via the Intercom messenger they will be converted to a Lead which is viewable in the Intercom dashboard
Any other attribute not listed below and not in the Messenger Attributes will be treated as a custom user attribute
If the value of a custom user attribute is set to an empty string, or a string with the value "undefined", or "null", this will appear as Unknown in Platform.
If a value is set for a custom user attribute that has been configured to prevent updates via the Messenger then this value will be ignored in the request.

| Attribute                | Type                     | Description                                                                                                                                                                                                     |
| ------------------------ | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| email                    | string                   | The email address of the currently logged in user (Only applicable to users)                                                                                                                                    |
| user_id                  | string                   | The user_id address of the currently logged in user (Only applicable to users)                                                                                                                                  |
| created_at               | timestamp                | The Unix timestamp (in seconds) when the user signed up to your app (Only applicable to users)                                                                                                                  |
| name                     | string                   | Name of the current user/lead                                                                                                                                                                                   |
| phone                    | string                   | Phone number of the current user/lead                                                                                                                                                                           |
| last_request_at          | timestamp                | This value can't actually be set by the Javascript API (it automatically uses the time of the last request but is a this is a reserved attribute)                                                               |
| unsubscribed_from_emails | boolean                  | Sets the [unsubscribe status](https://docs.intercom.com/faqs-and-troubleshooting/unsubscribing-users/how-do-i-unsubscribe-users-from-receiving-emails) of the record                                            |
| language_override        | string                   | Set the messenger language programmatically (instead of relying on browser language settings)                                                                                                                   |
| utm_campaign             | string                   | UTM Campaign valueNote: All UTM parameters are updated automatically and can not be manually overidden                                                                                                          |
| utm_content              | string                   | UTM Content value                                                                                                                                                                                               |
| utm_medium               | string                   | UTM Medium value                                                                                                                                                                                                |
| utm_source               | string                   | UTM Source value                                                                                                                                                                                                |
| utm_term                 | string                   | UTM Term value                                                                                                                                                                                                  |
| avatar                   | avatar object            | Set the avatar/profile image associated to the current record (typically gathered via social profiles via email address)                                                                                        |
| user_hash                | string                   | Used for identity verification (Only applicable to users)                                                                                                                                                       |
| company                  | company object           | Current user's company (Only applicable to users) For field definitions see Company Object in the section below Note: Company ID and company name are the minimum requirements to pass a company into Intercom. |
| companies                | array of company objects | An array of companies the user is associated to (Only applicable to users)                                                                                                                                      |
| page_title               | string                   | Used for keeping track of user page views. Default value is the document title property.                                                                                                                        |

---

Further instructions on how to customize the messenger and using Intercom API can be found in our [dev docs](https://developers.intercom.com/installing-intercom/web/installation/).

## Troubleshooting

- #### Messenger not showing on page.

  - Check if the correct `appId` is being sent.
  - Check if the Messenger is `live` on your Intercom settings page.
  - Check if the code is running on the **user's browser and not on the your server**.

- #### No user data available

  - Make sure you are sending the correct user hash as explained on your Intercom setup page.
  - Make sure all the user data is set either on initialization or on update.

- ### Use with other frameworks
  This package was made using plain JS. This means that it is not be limited to the frameworks mentioned.

---

## Author

👤 **Intercom (https://www.intercom.com/)**

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

This project is [MIT](LICENSE) licensed.

---

Created with ❤️ by [Intercom](https://intercom.com/)
