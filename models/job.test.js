"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./job.js");
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    testJobIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
    test("works", async function () {
        const job = await Job.create({
            title: "Developer",
            salary: 50000,
            equity: "0.05",
            companyHandle: "c1",
        });

        expect(job).toEqual({
            id: expect.any(Number),
            title: "Developer",
            salary: 50000,
            equity: "0.05",
            companyHandle: "c1",
        });
    });
});

/************************************** findAll */

describe("findAll", function () {
    test("works: no filter", async function () {
        let jobs = await Job.findAll();
        expect(jobs).toEqual([
            {
                id: testJobIds[0],
                title: "job1",
                salary: 10000,
                equity: "0.1",
                companyHandle: "c1",
                companyName: "C1",
              },
              {
                id: testJobIds[1],
                title: "job2",
                salary: 20000,
                equity: "0.2",
                companyHandle: "c1",
                companyName: "C1",
              },
              {
                id: testJobIds[2],
                title: "job3",
                salary: 30000,
                equity: "0",
                companyHandle: "c1",
                companyName: "C1",
              },
              {
                id: testJobIds[3],
                title: "job4",
                salary: null,
                equity: null,
                companyHandle: "c1",
                companyName: "C1",
              },
        
        ]);
    });

    test("works: filter by title", async function () {
        let jobs = await Job.findAll({ title: "job1" });
        expect(jobs.length).toEqual(1); // Assuming 1 job with 'job1' in the title
    });

    test("works: filter by minSalary", async function () {
        let jobs = await Job.findAll({ minSalary: 25000 });
        expect(jobs.length).toEqual(1); // Assuming 1 job have at least 25000 salary
    });

    test("works: filter by equity", async function () {
        let jobs = await Job.findAll({ hasEquity: true });
        expect(jobs.length).toEqual(2); // Assuming 2 jobs has equity
    });

    test("works: filter by minSalary and equity", async function () {
        let jobs = await Job.findAll({ minSalary: 15000, hasEquity: true });
        expect(jobs.length).toEqual(1); // Assuming 1 job will filter
    });
});

/************************************** get */

describe("get", function () {
    test("works", async function () {
        let job = await Job.get(testJobIds[0]);
        expect(job).toEqual({
            id: testJobIds[0],
            title: "job1",
            salary: 10000,
            equity: "0.1",
            company: {
                handle: "c1",
                name: "C1",
                description: "Desc1",
                numEmployees: 1,
                logoUrl: "http://c1.img",
            },
        });
    });

    test("not found if no such job", async function () {
        try {
            await Job.get(0);
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/************************************** update */

describe("update", function () {
    const updateData = {
        title: "New",
        salary: 50000,
        equity: "0.8",
    };

    test("works", async function () {
        let job = await Job.update(testJobIds[0], updateData);
        expect(job).toEqual({
            id: testJobIds[0],
            companyHandle: "c1",
            ...updateData,
        });
    });

    test("not found if no such job", async function () {
        try {
            await Job.update(0, updateData);
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });

    test("bad request with no data", async function () {
        try {
            await Job.update(testJobIds[0], {});
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

/************************************** remove */

describe("remove", function () {
    test("works", async function () {
        await Job.remove(testJobIds[0]);
        const res = await db.query(
            "SELECT id FROM jobs WHERE id=$1",[testJobIds[0]]);
        expect(res.rows.length).toEqual(0);
    });

    test("not found if no such job", async function () {
        try {
            await Job.remove(0);
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});
