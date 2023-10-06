import mariadb from 'mariadb';

class Database {
     constructor(){
        this.pool = mariadb.createPool({
            host:'localhost',
            user:'root',
            password:'vl123456',
            database:'githubMetrics'
        });
    }
}

const dataBase = new Database();
export default dataBase;