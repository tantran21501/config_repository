/* MS SQL  */

// Step 1: Pull images from https://hub.docker.com/
//2019-latest:  docker pull mcr.microsoft.com/mssql/server:2019-latest  // tag = version
// Step 2: Create containers from images
// 1 image => multiple containers
// docker run -d
// -d: detach(background) mode
// -e: environment  variable
// \: create new line (Linux)
// --name: container name
// -p: map port
// -v: "host' volum":"container's volume"
// Example:
// docker run \
// -e "ACCEPT_EULA=Y" \
// -e "MSSQL_SA_PASSWORD=Abcd1234!" \
// --name sql-server-2019-container \
// -p 1435:1433 \
// -v /Users/tan.tran2/Desktop/temp:/var/opt/mssql
// -d mcr.microsoft.com/mssql/server:2019-latest

// -f: force
// remove containers: docker stop [container_id] => docker rm [container_id] or docker rm -f [container_id]
// show all volume: docker volume ls
// inspect volume: docker volume inspect [volume_name]
// ls: list, -la: list all
// ls -la ~/Library/Containers/com.docker.docker/Data  (MacOS)
// \\wsl$\docker-desktop-data\version-patch-data\community\docker\volumes (Window)

/* MySQL */
// Create container:
// docker run --name mysql-container -p3308:3306 -v mysql8-volume:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=Abcd@1234 -d mysql:8.0.31
// Go inside container:
// -it: interactive mode
// docker exec -it mysql-container bash
//Then : mysql -u root -p
//Show database: show databases;

/* CREATE NETOWRK */
// docker network create [network_name]

/* Multiple containers */
// -it: interactive mode(contact terminal of container)
// -d: detach mode
// CREATE MYSQL Container:
// docker run -d --name mysql-container --network todo-app-network --network-alias todo-app-network-alias -v todo-mysql-database:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=Abcd@1234 -e MYSQL_DATABASE=todoDB mysql:8.0.31
// CREATE LINUX OS Container:
// docker run -it --network todo-app-network --name netshoot-container nicolaka/netshoot
// dig: DNS look up ultility
// dig todo-app-network-alias
// CREATE NODE Container:
// -w: working directory
// pwd: current folder
// docker run -d -p3002:3000 --name todo-app-container -w /app -v "$(pwd):/app" --network todo-app-network -e MYSQL_HOST=todo-app-network-alias -e MYSQL_USER=root -e MYSQL_PASSWORD=Abcd@1234 -e MYSQL_DB=test node sh -c "yarn install && yarn run dev"

// *** SPRING BOOT***
// # syntax=docker/dockerfile:1
// # Which "official Java image" ?
// FROM openjdk:oraclelinux8
// # working
// WORKDIR /usr/scr/app
// # Copy from your host(PC) to container
// COPY .mvn/ .mvn
// COPY mvnw pom.xml ./
// # Run this inside the image
// RUN ./mvnw dependency:go-offline
// COPY src ./src
// # Run inside container
// CMD ["./mvnw","spring-boot:run"]

/** Build */
// docker build --tag [image_name] .
// change tag image
// docker tag [old_name_image] [new_name_image]
// push docker push [new_name_image]
// docker run -dp 8085:8083 --name [container_name] -v "[current_folder]:/app" tantran2/spring-boot:v1.0.0
//update code : docker restart [container_name]
// docker run -dp 8085:8083 --name spring-boot-container -v /Users/tan.tran2/Desktop/docker_spring/JavaDockerExample:/app tantran2/spring-boot:v1.0.0

//Clone source from git with docker:
// docker run --name [container_name] [image_name] clone [link git]
// copy : docker cp [container_name]:/git/

/* COMMAND DOCKER */

// IMAGE:
// pull image:    docker image pull <image>  (Default tag = latest),  docker image pull <image>:<tag>
// push image:    docker image push <image>
// list images :  docker image ls, docker images
// delete all images which are not using: docker image prune

// CONTAINER:
// Run container: docker container run <image>

/*
   EX:   docker run -it <image> 
   -i or interactive: keep STDIN open even if not attached
   -t or --tty: allocate a pseudo-TTY(TeleTYpewriter)
   To exit ctrl+D or ctrl+C
   Để thoát khỏi container tạm thời: Ctrl+P+Q
   Để vào lại container docker attach <container_id>
   docker run -d <image>: Chạy ngầm container từ lúc khởi tạo luôn.
   
   Mở SSH ( tiến trình thứ cấp) chạy song song với PID của container
   (không ảnh hưởng đến tiến trình PID đang chạy của container, giữ cho container luôn sống)
   docker exec -it <container_id> sh
   docker exec -it <container_id> bash

   port mapping: ngăn cản user truy cập vào container 
   docker run -p <targer_port>:<container_port> <image>


*/
// list containers are using: docker container ls  ( docker ps )
// list all containers: docker container ls -a ( docker ps -a)
// Stop container: docker container stop <container_id>
// Delete all Containers which are not using: docker container prune
// Run CMD in container: docker container exec <container_id> <command>
// Show logs: docker logs -f <container_id> (-f: following logs)

// VOLUME: Vitual folder. Bind mout data from local to container
// Create volume: docker volume create [volume_name]
// Run container with volume: docker run -v [local_dir/volume]:[container_dir] .....
// container_dir: search on docker hub

/** DOCKERFILE */
/*
 FROM <image> Tạo ra 1 image mới từ image gốc
 RUN <Command> Chạy các câu lệnh trong container
 WORKDIR <directory>  Tạo thư mục mặc định khi container được khởi tạo
 COPY <src> <dest> COPY thư mục từ local sang container
 ADD <src/url> <dest>  ADD tương tự copy nhưng có thể tải file từ internet về và giải nén
 EXPOSE <port> comment port cho người đọc docker file
 CMD command  Thực thi khi run container    //shell form
 CMD ["command" ,"argument 1", "argument 2",...]   //Exec form
*/
/** DOCKER COMPOSE */
// docker-compose.yaml
/*
 # comment
 object: 
    title: abc
    person:
      name: xyz
      birthday: 15
 array:
    lists:
      - id: 1
        name: a
      - id: 2
        name: b  
**** Cú pháp file yaml: 
version: '3' (Theo trang chủ docker engine)
services:                                   // container
  pg:                                       // tên container postgres
    image: postgres:9.6-alpine              // FROM Image 
    ports:                                  //  ports array
      -5432:5432
    volumes:                                // volumes array
      - pgdata:/var/lib/postgresql/data
    environment:                            // Biến môi trường 
      POSTGRES_DB: postgres
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
  frontend:
    image: tantran2/frontend:latest
    build:   
      context: .
    ports:
      - 80:80
    environment:
     appURL: localhost:80
     appPort: 80
     backendUrl: http://localhost:8080
     pathRewrite: api
  backend:
    image: tantran2/backend:latest
    ports:
     - 8080:80
    environment:
      PORT: 80
      DB_HOST: pg
      DB_NAME: postgres
      DB_USERNAME: postgres
      DB_PASSWORD: postgres
      DB_SCHEMA: public
      DDL_METHOD: update
volumes:
  pgdata:
****

Lệnh compose:
docker-compose build <service_name> ( không cần build context "." vì đã cấu hình trong file yaml)
docker-compose up: Đọc file yaml và khởi tạo toàn bộ services, mỗi service sẽ là 1 container.
docker-compose up <service_name> : nếu không muốn khởi tạo toàn bộ service, chỉ định service cần tạo
docker-compose up -d <service_name>: Chạy ở detach mode
docker-compose logs -f <service_name>: in log
docker-compose stop <service_name>: Dừng service
docker-compose down: shutdown toàn bộ container, giải phóng bộ nhớ
*/

/** NETWORK */
/* 
Create network: docker network create <network_name>
List all network: docker network ls
Delete network: docker network rm <network_name>
Inspect network: docker network inspect <network_name>
Connect network: docker network connect <network_name> <container_name>
Disconnect network: docker network disconnect <network_name> <container_name>

*/

/* EXIT CODE DOCKER:
0: Docker exit without error
130: User exit
137: Container exit not probadly 
*/
/*
# VIẾT THEO CÚ PHÁP YAML, CHÚ Ý CHÍNH XÁC KHOẢNG TRẮNG ĐẦU CÁC DÒNG

version: "3"                      # chọn viết theo bản 3 docs.docker.com/compose/compose-file/

services:                         # CÁC DỊCH VỤ (CONTAINER) NĂM TRONG services
  pro-memcached:                  # (((1))) BẮT ĐẦU TẠO DỊCH VỤ THỨ NHẤT
    image: "memcached:latest"     # Image tạo ra dịch vụ
    container_name: c-memcached01 # Tên container khi chạy
    restart: always
    hostname: memcached
    networks:
      - my-network                # nối vào mạng my-network (tạo mạng này ở dưới)
    command:
      - "--conn-limit=2048"       # Giới hạn kết nối là 2048
      - "--memory-limit=2048"     # Giới hạn cho phép dùng tới 4096 MB bộ nhớ làm cache
  xtlab-apache:                   # (((2))) TẠO DỊCH VỤ HTTPD
    image: "httpd:version2"       # sử dụng image custome lại ở trên để tạo container
    container_name: c-httpd01     # tên khi chạy container HTTPD
    restart: always
    hostname: httpd01
    networks:
      - my-network
    ports:
      - "8080:80"                 # Mở cổng 8080 public, ánh xạ vào 80
      - "443:443"

    volumes:                      # Ánh xạ thự mục vào container
      - dir-site:/home/sites/     # Bind ổ đĩa - dir-site
  xtlab-mysql:                      # (((3))) TẠO DỊCH VỤ MYSQL
    image: "mysql:latest"
    container_name: mysql-product
    restart: always
    hostname: mysql01
    networks:
      - my-network
    environment:
      MYSQL_ROOT_PASSWORD: abc123   #Thiết lập password
    volumes:
      - /mycode/db:/va
      
      
      
      r/lib/mysql  # thư mục lưu DB
      - /mycode/db/my.cnf:/etc/mysql/my.cnf  # ánh xạ file cấu hình
  xtlab-php:                         # (((4))) TẠO DỊCH VỤ PHP
    image: "php:version2"
    container_name: php-product      # tên container
    hostname: php01
    restart: always
    networks:
      - my-network
    volumes:
      - dir-site:/home/sites/        # Bind ổ đĩa - dir-site

networks:                             # TẠO NETWORK
  my-network:
    driver: bridge
volumes:                              # TẠO Ổ ĐĨA
  dir-site:                           # ổ đĩa này lưu dữ liệu ở /mycode/
    driver_opts:
      device: /mycode/                # Hãy đảm bảo có thư mục /mycode/default
      o: bind
*/
/*
  microservice/accounts: image name
  tantran2/microservice: repository docker hub
 docker tag microservice/accounts docker.io/tantran2/microservice:latest
 docker push docker.io/tantran2/microservice

 */
