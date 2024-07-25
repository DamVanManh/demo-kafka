*** làm rõ một số khái niệm, chuổi video 4 phần này giải thích khá ok: https://youtu.be/_mw5QupT4ts?si=v8WOEosLKBQNqIjr
- overall thì kafka là một phần mềm trung gian cho phép gửi tin nhắn(data) giữa nhiều MS một cách realtime, ví dụ A muốn gửi tin nhắn cho B
	bằng kafka thì phải có một tập hợp máy chủ trung gian gọi là Kafka cluster(cung cấp 1 địa chỉ để A B cùng kết nối tới), A > kafka > B. Tin nhắn thường là
	dạng json
- Kafka cluster: là tên gọi chung chỉ việc set up nhiều máy chủ liên kết với nhau để cung cấp dịch vụ Kafka
- Zookeeper: khi start lên nó sẽ chiếm dụng 1 port là 2181 > địa chỉ port này dùng để quản lý tất cả mọi thứ trong kafka
run: bin/zookeeper-server-start.sh config/zookeeper.properties
- Kafka broker service: khi start local lên nó sẽ chiếm dụng cổng 9092 > nó sẽ kết nối tới 2181
	> sau đó ta được 1 broker local: localhost:9092 > địa chỉ mà A và B kết nối tới

- Producer: bên gửi tin nhắn, máy A sẽ setup kết nối với kafka và gủi đi tin nhắn
- Consumer: bên nhận tin nhắn, máy B sẽ setup kết nối với kafka và luôn lắng nghe từ kafka để nhận được tin nhắn
- clientId: luôn phải là unique, để phân biệt giữa các client > k thì có lỗi
- groupId: 
	- const consumer = kafka.consumer({ groupId: "test-group" });
	- mỗi consumer(bên nhận message) có một groupId riêng biệt
	- giả sử 2 consumer đều subscribe vào cùng một topic thì:
		- 2 consumer sử dụng 2 groupId khác nhau: 2 consumer đều nhận được message
		- 2 consumer sử dụng chung groupId: chỉ 1 consumer nhận được message, các consumer còn lại không nhận được message > giúp cân bằng tải >
			1 thằng đã xử lý rồi thì mấy thằng khác không cần xử lý nữa
- fromBeginning là một cờ (flag) được sử dụng trong Kafka Consumer để chỉ định liệu consumer có nên đọc tin nhắn từ đầu hay chỉ đọc từ khi subcribe
_ Brokers trong Kafka là các máy chủ chịu trách nhiệm lưu trữ, phân phối và quản lý tin nhắn trong hệ thống Kafka
	- 	const kafka = new Kafka({
		  clientId: "my-app2",
		  brokers: ["localhost:9092"], // lúc setup thì đây là brokers
		});
	- nếu 2 consumer subcribe cùng một topic, khác groupId, mặc dù khác broker thì cũng không ảnh hưởng gì, cả 2 consumer đều nhận được tin nhắn

*** demo này dựa trên video: https://youtu.be/g7VvvWkoXj0?si=0ycxo6nPV5_BeV1a
- cài java JDK 17 trở lên, setup env JAVA_HOME
- cài docker desktop: https://docs.docker.com/desktop/install/windows-install/
- run terminal: docker-compose up -d // run tại path docker-compose.yml, run lệnh này để tạo máy chủ brokers: "localhost:9092"
- install và start 2  MS
- thử call api để send message và xem bên subcribe có nhận được message hay không


*** thử làm theo video này mà run docker-compose bị lỗi: https://youtu.be/3pxr45ufnRc?si=gC5mjc8Dzqv-VfXV
*** hiểu rõ https://kafka.apache.org/intro và https://kafka.js.org/:
	- cần có máy chủ kafka > cần phải cài cái này https://kafka.apache.org/intro > bên dưới sẽ dùng docker > k cần cài
	- dùng kafkajs (https://kafka.js.org/) để giao tiếp với máy chủ kafka bằng nodejs

*** giải thích chi tiết mà vẫn k hiểu: https://youtu.be/Ch5VhJzaoaI?si=Xh0MZueSXutxMseF
sub:
Apache Kafka is the answer to the problems faced by the distribution and the scaling of messaging systems.
let me try to illustrate this by an example
 imagine we were to design a system that listens to various basketball game updates from various sources
 such updates might include game scoring participants and timing information
 it then displays the games status on various channels such as mobile devices and computer browsers
 in our architecture we have a process that reads these updates and writes them in a queue
 we call this process a producer
 since it's producing these updates onto the queue
 at the head of this queue a number of downstream processes consume these updates to display them on the various channels
 we call these processes consumers
 over time we decide to expand and start following more and more games
 the problem is that our servers are now struggling to handle the load
 this is mainly because the queue is hosted on one server which is running out of memory and processing capacity
 our consumers are also struggling in a similar fashion
 so now we start thinking of how we can add more computing power by distributing our architecture
 but how do we go about distributing AQ data structure
 by its nature the items in a queue follow a specific ordering
 we could try to randomly distribute the contents of the queue onto multiple ones
 if we do this our consumers might consume the updates in the wrong order
 this would result in inconsistencies
 for example the wrong scoring being displayed across the channels
 one solution is to let the application specify the way to distribute the items in the queue
 in our example we could distribute the items using the match name
 meaning that the updates coming from the same match would be on the same queue
 this strategy would maintain an ordering per basketball match
 this is the basic fundamental difference of Kafka from other messaging systems
 that is item sent and received Kafka require a distribution strategy
 let's have a look at some more detail and terminology used
 in Kafka each one of these queues is called the partition
 and the total number of partitions is called a partition count
 each server holding one or more of these partitions is called a broker
 and each item in a partition is called a record
 the field used decide which partition the record should be stored in it's called the partition key
 it's up to the application to decide which field to use as the partition key
 if no key is specified Kafka simply assigns a random partition
 a grouping of partitions handling the same type of data is called a topic
 in order to identify each record uniquely Kafka provides a sequential number to each record
 this is called an offset
 essentially a recording that topic is identified by a partition number and an offset
 in our application since we have now distributed our data in the topic using the name as the partition key
 we can now also parallelize our consumer applications having one consumer per partition guarantees ordering per game
 consumers can live on one machine or distributed amongst multiple ones
 one important concept in Kafka is that consumers are very lightweight and we can create many of them without affecting performance
 this is mainly because Kafka only needs to maintain the latest offsets read by each consumer
 typically consumers read one record after the other and resume from where they left after a restart
 however in Kafka it's up to the consumer implementation to decide on how to consume records
 it's quite common to have consumers to read all the records from the beginning on startup
 or to read the record in different orders such as reading back to front for example
 in Kafka each consumer belonging to the same consumer group do not share partitions
 this means that each consumer would read different records from the other consumers
 multiple consumer groups are useful when you have different applications reading the same contents
 in our example we could have a consumer group called mobile and another consumer group called computer
 these groups will read the same records but update different channels
 each consumer in these groups will have separate offset pointers to keep track which latest record was read
 if consumers can read using custom ordering
 how can Kafka determine that the record has been consumed and it can safely delete that record
 so it can free up space
 the answer is that tough comp provides various policies that allow it to do a record cleanup
 for example using irritation policy you can provide a record age limits
 say 24 hours after which the records are automatically deleted
 using this policy if your consumer application is never down for more than this age limit no messages are lost
 another capability of Kafka is to store records in a fault tolerant and durable way
 each record is stored on persistent storage so that if a broker goes down it can recover when it comes back up
 additionally Kafka replicates partitions so that when a broker goes down a backup partition takes over and processing can resume
 this replication is configured using a replication factor
 for example a replication factor of three leads to three copies of a partition
 one leader and two backups
 this means that we can tolerate up to two brokers going down at the same time
 Kafka can be a solution to your scalability and redundancy problems
 if the problem is well stated and the technologies are well understood
 there are of course a lot more technical and implementation details which can be found on kafkas documentation
 I hope that this short video has been helpful at providing an introduction but the fundamental concepts in Kafka
 if you like it please give it a thumbs up and subscribe.
