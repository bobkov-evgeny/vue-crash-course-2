"use strict";

const app = Vue.createApp({
	data() {
		return {
			firstName: "John",
			lastName: "Doe",
			email: "john@gmail.com",
			gender: "male",
			picture: "https://randomuser.me/api/portraits/men/10.jpg",
		};
	},
	methods: {
		async getUser() {
			const res = await axios
				.get("https://randomuser.me/api")
				.catch((err) => console.error(err));

			this.firstName = res.data.results[0].name.first;
			this.lastName = res.data.results[0].name.last;
			this.email = res.data.results[0].email;
			this.gender = res.data.results[0].gender;
			this.picture = res.data.results[0].picture.large;
		},
	},
});

app.mount("#app");

const inputRub = document.querySelector("#rub");
const inputUsd = document.querySelector("#usd");

inputRub.addEventListener("input", () => {
	const request = new XMLHttpRequest();

	request.open(`GET`, "current.json");
	request.setRequestHeader("Content-type", "application/json; charset=utf-8");
	request.send();

	request.addEventListener("readystatechange", () => {
		if (request.readyState === 4 && request.status === 200) {
			const data = JSON.parse(request.response).current.usd;
			inputUsd.value = (+inputRub.value / data).toFixed(2);
		} else {
			inputUsd.value = "Что-то пошло не так";
		}
	});
});

const form = document.querySelector("form");
const message = {
	loading: "Загрузка",
	success: "Спасибо! Скоро мы с Вами свяжемся",
	failure: "Что-то пошло не так...",
};

function postData(form) {
	form.addEventListener("submit", function (e) {
		e.preventDefault();

		const statusMessage = document.createElement("div");
		statusMessage.classList.add("status");
		statusMessage.textContent = message.loading;
		form.append(statusMessage);

		const request = new XMLHttpRequest();
		request.open("POST", "server.php");

		request.setRequestHeader("Content-type", "application/json");
		const formData = new FormData(form);
		const object = {};
		formData.forEach((value, key) => (object[key] = value));
		const json = JSON.stringify(object);

		request.send(json);
		request.addEventListener("load", () => {
			if (request.status === 200) {
				console.log(request.response);
				statusMessage.textContent = message.success;
				form.reset();
				setTimeout(() => {
					statusMessage.remove();
				}, 2000);
			} else {
				statusMessage.textContent = message.failure;
			}
		});
	});
}
postData(form);

///////////////////////////////////////////////////////

console.log("Запрос данных...");
const req = new Promise(function (resolve, reject) {
	setTimeout(() => {
		console.log("Подготовка данных...");

		const product = {
			name: "TV",
			price: 2000,
		};

		resolve(product);
	}, 2000);
});

req
	.then((product) => {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				product.status = "oreder";
				resolve(product);
			}, 2000);
		})
			.then((data) => {
				data.modify = true;
				return data;
			})
			.then((data) => console.log(data));
	})
	.catch((err) => console.error("Произошла ошибка"))
	.finally(() => {
		setTimeout(() => {
			console.log("Запрос данных завершен");
		}, 1000);
	});

const test = (time) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			console.log(`test ${time}ms`);
			resolve();
		}, time);
	});
};

Promise.race([test(1000), test(2000)]).then(() => console.log("Done"));
