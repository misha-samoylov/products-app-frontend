all: create run

create:
	sudo docker build -t product-app-frontend .

run:
	sudo docker run --name instance-product-app --rm -p 9000:9000 product-app-frontend

stop:
	sudo docker stop instance-product-app

clean:
	sudo docker rmi product-app-frontend
