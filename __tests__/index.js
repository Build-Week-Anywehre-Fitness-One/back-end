const supertest = require("supertest")
const server = require("../server")
const db = require("../data/dbConfig")


beforeEach(async () => {
    await db.seed.run();
});


afterAll(async () => {
    await db.destroy()
})


describe("users intergration test", () => {
    it("GET / => returns status 401 if not authenticated", async () => {
        const res = await supertest(server)
            .get("/api/users")
        expect(res.statusCode).toBe(401)
    })

    it("GET / => returns status 200", async () => {
        const registerRes = await supertest(server)
            .post("/api/register")
            .send({ username: "jimmy", password: "123", role: "instructor", auth_code: "32ML0321*)" })
        expect(registerRes.statusCode).toBe(201)
        const loginRes = await supertest(server)
            .post("/api/login")
            .send({ username: "jimmy", password: "123" })
        const res = await supertest(server)
            .get("/api/users")
            .set({ authorization: loginRes.body.token })
        expect(res.statusCode).toBe(200)
    })


    it("LOGIN / => returns welcome users", async () => {
        const registerRes = await supertest(server)
            .post("/api/register")
            .send({ username: "jimmy", password: "123", role: "instructor", auth_code: "32ML0321*)" })
        expect(registerRes.statusCode).toBe(201)

        const res = await supertest(server)
            .post("/api/login")
            .send({ username: "jimmy", password: "123" })
        expect(res.statusCode).toBe(200)
    })


    it("CREATE CLASS / => creating a new class", async () => {
        const registerRes = await supertest(server)
            .post("/api/register")
            .send({ username: "jimmy", password: "123", role: "instructor", auth_code: "32ML0321*)" })
        expect(registerRes.statusCode).toBe(201)

        const loginRes = await supertest(server)
            .post("/api/login")
            .send({ username: "jimmy", password: "123" })

        const res = await supertest(server)
            .post("/api/classes")
            .send({ name: "Yoga", type: "workout", startTime: "08:30", date: "2020-02-31", duration: 30, intensity: "medium", location: "1600 Pennsylvania Ave, WA, DC 20500", numberOfRegisterAttendees: 20, maxClassSize: 25 })
            .set("Authorization", loginRes.body.token)
        expect(res.statusCode).toBe(201)
    })

    it("UPDATE CLASS / => updating a class", async () => {
        const registerRes = await supertest(server)
            .post("/api/register")
            .send({ username: "jimmy", password: "123", role: "instructor", auth_code: "32ML0321*)" })
        expect(registerRes.statusCode).toBe(201)

        const loginRes = await supertest(server)
            .post("/api/login")
            .send({ username: "jimmy", password: "123" })

            const createRes = await supertest(server)
            .post("/api/classes")
            .send({ name: "Yoga", type: "workout", startTime: "08:30", date: "2020-02-31", duration: 30, intensity: "medium", location: "1600 Pennsylvania Ave, WA, DC 20500", numberOfRegisteredAttendees: 20, maxClassSize: 25 })
            .set("Authorization", loginRes.body.token)
        expect(createRes.statusCode).toBe(201)
        //console.log("this is createRes",createRes.body)

            const res = await supertest(server)
            .put("/api/classes/1")
            .send({startTime: "10:00"})
            .set("Authorization", loginRes.body.token)
        expect(res.statusCode).toBe(200)
        //console.log("this is res",res.body)    
    })

    it("DELETE CLASS / => deleting a class", async () => {
        const registerRes = await supertest(server)
            .post("/api/register")
            .send({ username: "jimmy", password: "123", role: "instructor", auth_code: "32ML0321*)" })
        expect(registerRes.statusCode).toBe(201)

        const loginRes = await supertest(server)
            .post("/api/login")
            .send({ username: "jimmy", password: "123" })

            const createRes = await supertest(server)
            .post("/api/classes")
            .send({ name: "Yoga", type: "workout", startTime: "08:30", date: "2020-02-31", duration: 30, intensity: "medium", location: "1600 Pennsylvania Ave, WA, DC 20500", numberOfRegisteredAttendees: 20, maxClassSize: 25 })
            .set("Authorization", loginRes.body.token)
        expect(createRes.statusCode).toBe(201)

        const res = await supertest(server)
            .delete(`/api/classes/${createRes.body.id}`)
            .send({id: 1})
            .set("Authorization", loginRes.body.token)
        expect(res.statusCode).toBe(200) 
    })

    it("SEARCH FOR CLASS / => searching for a class", async () => {
        const registerRes = await supertest(server)
            .post("/api/register")
            .send({ username: "jimmy", password: "123", role: "instructor", auth_code: "32ML0321*)" })
        expect(registerRes.statusCode).toBe(201)

        const loginRes = await supertest(server)
            .post("/api/login")
            .send({ username: "jimmy", password: "123" })

            const createRes = await supertest(server)
            .post("/api/classes")
            .send({ name: "Yoga", type: "workout", startTime: "08:30", date: "2020-02-31", duration: 30, intensity: "medium", location: "1600 Pennsylvania Ave, WA, DC 20500", numberOfRegisteredAttendees: 20, maxClassSize: 25 })
            .set("Authorization", loginRes.body.token)
        expect(createRes.statusCode).toBe(201)

        const res = await supertest(server)
            .get("/api/classes/search")
            .send({ type: "medium"})
            .set("Authorization", loginRes.body.token)
        expect(res.statusCode).toBe(200)
    } )
})