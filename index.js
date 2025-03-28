function createEmployeeRecord(array) {
    return {
        firstName: array[0],
        familyName: array[1],
        title: array[2],
        payPerHour: array[3],
        timeInEvents: [],
        timeOutEvents: []
    };
}

function createEmployeeRecords(arrays) {
    return arrays.map(createEmployeeRecord);
}

function createTimeInEvent(dateTimeString) {
    const employee = this || {}; // Handle both direct calls and calls with 'this'
    
    if (!dateTimeString || typeof dateTimeString !== 'string') {
        throw new Error("Invalid dateTimeString provided");
    }

    const [date, hour] = dateTimeString.split(" ");
    
    if (!date || !hour) {
        throw new Error("dateTimeString must be in 'YYYY-MM-DD HHMM' format");
    }

    employee.timeInEvents = employee.timeInEvents || [];
    employee.timeInEvents.push({
        type: "TimeIn",
        hour: parseInt(hour, 10),
        date: date
    });

    return employee;
}

function createTimeOutEvent(dateTimeString) {
    const employee = this || {}; // Handle both direct calls and calls with 'this'
    
    if (!dateTimeString || typeof dateTimeString !== 'string') {
        throw new Error("Invalid dateTimeString provided");
    }

    const [date, hour] = dateTimeString.split(" ");
    
    if (!date || !hour) {
        throw new Error("dateTimeString must be in 'YYYY-MM-DD HHMM' format");
    }

    employee.timeOutEvents = employee.timeOutEvents || [];
    employee.timeOutEvents.push({
        type: "TimeOut",
        hour: parseInt(hour, 10),
        date: date
    });

    return employee;
}

function hoursWorkedOnDate(date) {
    const employee = this;
    const timeIn = employee.timeInEvents.find(e => e.date === date).hour;
    const timeOut = employee.timeOutEvents.find(e => e.date === date).hour;
    return (timeOut - timeIn) / 100;
}

function wagesEarnedOnDate(date) {
    const employee = this;
    return hoursWorkedOnDate.call(employee, date) * employee.payPerHour;
}

const allWagesFor = function () {
    const eligibleDates = this.timeInEvents.map(function (e) {
        return e.date
    })

    const payable = eligibleDates.reduce(function (memo, d) {
        return memo + wagesEarnedOnDate.call(this, d)
    }.bind(this), 0) // <== Hm, why did we need to add bind() there? We'll discuss soon!

    return payable
}

function findEmployeeByFirstName(srcArray, firstName) {
    return srcArray.find(rec => rec.firstName === firstName);
}

function calculatePayroll(employeeRecords) {
    return employeeRecords.reduce((total, rec) => {
        return total + allWagesFor.call(rec);
    }, 0);
}
