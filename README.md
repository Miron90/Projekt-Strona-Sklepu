# Django React 

This is a e-commerce shop project it is make using React and Django Framework
the Frontend is written in React and backend is written in Python (Django)

The project presents as follows:

## Main Screen

![1.png](https://imgupload.pl/images/2022/01/18/home-screen.md.png)

## Products Screen
The products can be arrange using pagination. You can choose from 3 to 12 items per page.

If we set it to 6 it looks like.

![2.png](https://imgupload.pl/images/2022/01/18/strona-1.md.png)

If we set it to 3 it looks like.

![3.png](https://imgupload.pl/images/2022/01/18/strona-2.md.png)

## Basket Screen

The Basket looks like.

![4.png](https://imgupload.pl/images/2022/01/18/koszyk.md.png)

If you fill in the form you can pay using paypal.

![5.png](https://imgupload.pl/images/2022/01/18/paypal.md.png)

## Backend development workflow
To install the backend just type in console lines below it will automaticlly install and start backend server
```json
virtualenv env
source env/bin/activate
pip install -r requirements.txt
python manage.py runserver
```

## Frontend development workflow
To install the frontend just type in console lines below it will automaticlly install and start frontend server
```json
npm i
npm start
```

## For deploying
To run both frontend and backend just type line below
```json
npm run build
```
