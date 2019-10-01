# IronDashboard

IronDashboard is a project to create a better user experience of the Trello boards made by Ironhack for students during their bootcamp.

![img](https://i.imgur.com/6T2pjUd.jpg)

You can find belows some dashboard made in the past:
- https://irondashboard.surge.sh
- https://dev144.surge.sh
- https://dev152.surge.sh

## Pros and cons of IronDashboard

Pros:
- It takes about 3 seconds to load (Trello needs sometimes 10 seconds to load).
- The focus is done on the current day.
- You can find cards really fast.
- The content of a card is visible with clicking on it.
- And more!

Cons:
- You can't edit cards on the Dashboard, you have to use Trello.

## Code Setup

Let's say you have a squad that starts on **2019-08-05** with the Trello board [https://trello.com/b/**iW3IjFQW**/cohort-152](https://trello.com/b/iW3IjFQW/cohort-152).

After cloning the project, you need to create a `.env` file like this:
```
REACT_APP_TRELLO_BOARD_ID=iW3IjFQW
REACT_APP_FIRST_DAY=2019-08-05
```

Then you can run `npm start` to see the project on http://localhost:3000.

## Trello Setup

### Columns 
The names of the columns are very important:
- `Week X - Day Y` (`X` and `Y` must be digits and be careful with spaces): All the cards from this column are going to be displayed when the day is selected.
- `Websites`: All the cards from this column are rendered at the bottom of the page. You can add a thumbnail, such as `![](https://i.imgur.com/NYBu5TY.png)`.

### Card content (from a colum "Week X - Day Y")
When a card from "Week X - Day Y" is rendered, some information are used:
![](https://i.imgur.com/W6tij9s.png)


## Commands

To install all the packages:
```
npm install
```


To run the project in development mode (accessible on http://localhost:3000):
```
npm start
```


To build the project in a `build` folder:
```
npm run build
```

## Deployment 

You can deploy with the tool you want. If you want something super fast and easy to use, you can use [Surge](https://surge.sh) or [Netlify](https://www.netlify.com). 

### To deploy with Surge

To install Surge the first time on your computer:
```
npm install --global surge
```

Then to deploy on devXYZ.surge.sh:
```
npm run build
surge -p build -d https://devXYZ.surge.sh
```

### Technologies used

- React, generated with `create-react-app` 
- Axios
- Bootstrap + Reactstrap
- Trello API