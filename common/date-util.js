const DateUtil = class DateUtil {

    static getFirstDate (date) {
        let d = new Date();
        d.setFullYear(date.getFullYear(), date.getMonth(), 1);
        return d;
    }

    static getLastDate (date) {
        let d = new Date();
        d.setFullYear(date.getFullYear(), date.getMonth() + 1, 0);
        return d;
    }

    static toMonthString(date){
        return date.toISOString().split("-").splice(0, 2).join("-");
    }

    static toDateString(date){
        return date.toISOString().split("T")[0];
    }

}
