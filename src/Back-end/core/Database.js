import mariadb from 'mariadb';

class Database {
     constructor(){
        this.pool = mariadb.createPool({
            host:'localhost',
            user:'root',
            password:'password',
            database:'githubmetrics'
        });
    }
}

const dataBase = new Database();
export default dataBase;