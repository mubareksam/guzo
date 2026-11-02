# -*- coding: utf-8 -*-
"""Text of Assignment I, written as the student's own answers."""

STUDENT = {
    'name': 'Mubarek Seid',
    'id': 'UUR00703/17',
    'section': 'CCS7',
    'course': 'Data Communications and Computer Networking',
    'assignment': 'Assignment I',
    'date': '31 October 2026',
    'university': 'Unity University',
    'department': 'Department of Computer Science',
}

BLOCKS = [

# ------------------------------------------------------------------ intro
('h1', 'Introduction'),
('p', "Data communication and computer networking is one of those subjects where the "
      "definitions look simple until you try to use them on a real network. This paper answers "
      "the sixteen questions of Assignment I in that spirit. Each answer starts from the "
      "definition, then explains how the idea behaves in practice and, where the question asks "
      "for one, shows it in a labelled diagram. The diagrams are drawn with a tool and kept in "
      "black and white with light shading, so that nothing is lost when the paper is printed. "
      "Definitions and standards that come from a book or an official document are marked with a "
      "number in square brackets and listed on the references page at the end."),

# ------------------------------------------------------------------ A
('h1', 'Section A: Fundamentals of Data Communications'),

('h2', 'Q1. Data communication, computer networks and the five components of a system'),
('p', "Data communication is the exchange of data between two devices through a transmission "
      "medium such as a cable, an optical fibre or the air. Two things separate it from simply "
      "storing data. First, the two devices must be part of the same communication system, which "
      "means one side is prepared to send while the other is prepared to receive. Second, both "
      "sides must follow the same rules while the data is moving. When a student copies a file "
      "from a laptop to a printer on the same desk, data communication has still taken place, "
      "even though the distance is less than a metre."),
('p', "A computer network is a set of devices, usually called nodes, connected by communication "
      "links so that they can exchange data and share resources. The nodes may be computers, "
      "phones, printers, servers or switches, and the links may be copper cable, fibre or radio. "
      "What turns a collection of equipment into a network is that every device can be addressed "
      "and can move data to the others, and that job is done by protocols [1]. A network can be "
      "as small as two laptops joined by one cable or as large as the internet, which is best "
      "described as a network of networks."),
('p', "Although installations look very different from one place to another, a data communication "
      "system is always built from the same five components: the message, the sender, the "
      "receiver, the transmission medium and the protocol. Figure 1 shows how they fit together."),
('fig', 'system', 'Figure 1: The five components of a data communication system.'),
('p', "The <b>message</b> is the data itself: a text message, a photograph, a voice call or a "
      "video stream. It is the reason the system exists, and its size and type decide how much of "
      "the medium will be needed. One SMS is a few hundred bytes, while one film on a streaming "
      "service is several gigabytes."),
('p', "The <b>sender</b>, or source device, is the equipment that produces the message and starts "
      "the transfer. A laptop that has just been told to send an email, a phone taking a "
      "photograph, or a camera in a lecture hall are all senders. Inside the sender there is "
      "usually a transmitter, which is the part that turns the digital data into a signal the "
      "medium can carry."),
('p', "The <b>receiver</b> is the destination device. It ends the transfer, reverses what the "
      "transmitter did and hands the data to the software that needs it. A web server answering a "
      "browser request, a printer receiving a document and a phone playing a voice note are all "
      "receivers. In a conversation both devices are sender and receiver at the same time."),
('p', "The <b>transmission medium</b> is the physical path the signal travels along. Copper cable "
      "such as UTP, optical fibre, and free space for radio, microwave or infrared are the usual "
      "choices. The medium is not always something you can touch: the Wi-Fi link between a phone "
      "and an access point is a medium made of radio waves, and it behaves differently from a "
      "cable because walls, distance and other transmitters affect it."),
('p', "The <b>protocol</b> is the set of rules that both sides agree to follow. It covers how the "
      "bits are encoded into a signal, how a frame or a packet is put together, how errors are "
      "detected, how the receiver says that it is ready, what speed to use and how the exchange is "
      "closed. Two devices can be joined by a perfect cable and still fail to communicate if they "
      "run different protocols, which is exactly what happens when a file is copied between "
      "machines that use different network software [1]. HTTP, TCP/IP and Ethernet are protocols "
      "of this kind."),

('h2', 'Q2. Computer networks and networking'),
('p', "A computer network is the arrangement itself: two or more devices joined by a medium, "
      "together with the hardware and software needed to move data between them. The definition "
      "has three parts, namely the nodes, the links and the rules the nodes follow [2]. A real "
      "example is the computer laboratory of a university, where about thirty PCs, a switch, a "
      "router, a printer and one server sit in a room and share files and a single internet "
      "connection. That laboratory is itself a computer network, and every device in it is used "
      "inside that network: without it, no PC in the room could reach the server or the internet."),
('p', "Networking is the activity rather than the object. It means designing, building, "
      "connecting, configuring, protecting and maintaining those devices so that they can "
      "communicate. Networking is what the technician does when he pulls UTP cable into a new "
      "classroom, terminates it to T568B, assigns IP addresses, mounts an access point and checks "
      "that the link to the head office is up. A real example is a bank connecting its branch "
      "office to headquarters in another city: installing the link, configuring the routers and "
      "making sure the teller software can reach the central database is all networking. It is "
      "used in a computer network in the sense that networking is what produces the network and "
      "keeps it working; the equipment alone would sit there doing nothing."),
('p', "The two words therefore describe the same subject from two sides. A network is the result, "
      "and networking is the process that creates and looks after it. In everyday speech people "
      "also use networking for the whole field of study, and they point to the internet as proof "
      "that many separately managed networks can be joined into one larger network when they agree "
      "to use the same protocols."),

('h2', 'Q3. The four characteristics that decide the quality of a data communication system'),
('p', "Whether a data communication system can be trusted is usually judged by four "
      "characteristics: delivery, accuracy, timeliness and jitter [1]. Each one describes a "
      "different way in which a system can fail."),
('p', "<b>Delivery</b> means the data must arrive at the intended destination and nowhere else. "
      "The system has to know the correct address and has to hand the data to the right device and "
      "the right program on that device. A network that delivers a payslip to the wrong employee "
      "has failed, even if every bit was transferred perfectly."),
('p', "<b>Accuracy</b> means the data must arrive without errors. Transmission is never perfect: "
      "the signal is weakened by distance and disturbed by noise from motors, fluorescent lights "
      "and nearby cables, so bits get flipped. Systems answer this with error-detecting codes such "
      "as CRC and with retransmission, which is why a corrupted download is normally repaired "
      "instead of being delivered half broken."),
('p', "<b>Timeliness</b> means the data must arrive while it is still useful. A share price or a "
      "live football score that arrives ten minutes late has no value at all. For voice and video "
      "the system also has to deliver at a steady rate, because data that arrives in bursts is "
      "useless even when all of it eventually arrives."),
('p', "<b>Jitter</b> is the variation in the delay between one packet and the next. If the first "
      "packet takes 20 ms and the second takes 120 ms, the voice on a call will break up and the "
      "picture will jump, even though the average delay looked acceptable when it was measured. "
      "Jitter is the reason real-time traffic is treated differently from a file download."),
('p', "A live online class is an application where all four are needed at once. Delivery keeps "
      "the lecture in the right virtual room and the right student account. Accuracy keeps the "
      "slides and the teacher's voice intact. Timeliness keeps the class interactive, so that a "
      "question asked now is answered now. Low jitter keeps the audio continuous instead of "
      "chopped into pieces. A file download can survive a delay of a few seconds, but a video "
      "class cannot, which is why the two applications are not engineered in the same way."),

# ------------------------------------------------------------------ B
('h1', 'Section B: Advantages and Challenges'),

('h2', 'Q4. Advantages and challenges for individuals, society and organisations'),
('p', "The same technology brings very different benefits and problems depending on who is using "
      "it, so the three cases are taken separately below."),
('p', "<b>For an individual</b>, the main gain is access. A student at Unity University can "
      "download lecture notes from the e-learning portal at midnight, submit an assignment through "
      "Google Classroom, follow a tutorial on YouTube when the textbook is not clear, and ask a "
      "classmate a question on Telegram without travelling across the city. Mobile money through "
      "telebirr means a taxi fare or a transfer to a relative no longer needs a visit to a bank "
      "branch. The challenge is that the same connection takes attention away. A two-hour study "
      "session can disappear into short videos, and the phone that is supposed to help with the "
      "assignment is also the device that sends a notification every minute. Privacy is the second "
      "cost. A photograph posted in a group can be forwarded to people the owner never intended to "
      "share it with, and messages that pretend to be from a bank are now common enough that "
      "almost every student has received one."),
('p', "<b>For society</b>, networking makes services cheaper and more widely available. "
      "Government offices publish forms and accept applications online, hospitals send X-ray "
      "images to a specialist in another city instead of sending the patient, and during an "
      "emergency one message reaches thousands of people in minutes. Farmers check market prices "
      "before deciding where to take their produce, which is a direct gain in income. The "
      "challenges are just as real. False information travels as quickly as true information, and "
      "during a crisis a rumour can cause more damage than the event itself. The digital divide is "
      "the second problem: a student in a rural woreda with no 4G coverage cannot compete with a "
      "student in Addis Ababa who has fibre at home, and the gap shows up in results and in job "
      "applications. The third is cybercrime, since banks, telecom operators and ordinary users "
      "all lose money to fraud that only exists because the network exists."),
('p', "<b>For an organisation</b>, a network is the difference between departments passing paper "
      "around and departments working from the same data. A hospital can keep one patient record "
      "that the laboratory, the pharmacy and the doctor all read, a company can run its accounting "
      "system on one server instead of thirty separate PCs, and staff can work from home over a "
      "VPN when the office is closed. Voice over IP removes a monthly telephone bill, and cloud "
      "storage replaces a room full of backup tapes. The challenges are security, cost and "
      "dependence. One ransomware attack can stop a hospital's records for days, and paying is "
      "often cheaper than the downtime, which is why such attacks continue. Building a proper "
      "network with switches, firewalls, backups and trained staff costs money that small "
      "businesses in Addis Ababa usually do not have, and the network has to be maintained long "
      "after it is installed. Finally, an organisation that has moved everything online cannot "
      "work at all when the link goes down, so the reliability of one cable becomes a business "
      "risk rather than an IT detail."),

# ------------------------------------------------------------------ C
('h1', 'Section C: Standards and Standards Organisations'),

('h2', 'Q5. Standards, and the difference between de facto and de jure standards'),
('p', "A standard is a documented set of rules, formats or procedures, agreed by a recognised "
      "body or accepted through wide use, that tells manufacturers and users how something should "
      "be built or how a process should work [2]. In networking a standard may describe a cable, "
      "a connector, a frame format, an addressing scheme or the behaviour of a protocol."),
('p', "Standards are essential for three reasons. The first is interoperability. If every vendor "
      "chose its own wiring and frame format, a switch from one company would not understand the "
      "frames produced by a card from another, and a network would be limited to a single brand. "
      "The second is a fair base for competition, because when compatibility is guaranteed buyers "
      "compare price and quality instead of worrying whether a device will work. The third is "
      "stability: a published and maintained standard protects the money an organisation has "
      "already spent, and it lets the subject be taught and tested in the same way in every "
      "laboratory. The RJ-45 connector and the T568B wiring order are small examples of how much "
      "trouble a shared standard saves."),
('p', "<b>De jure</b> standards are created by an official standards body and formally ratified. "
      "IEEE 802.3, the Ethernet standard, is an example: it was written, reviewed, voted on and "
      "published by the IEEE, and vendors build their products against it [4]. <b>De facto</b> "
      "standards are not created by a formal body. They become standards because almost everybody "
      "uses them. The TCP/IP protocol suite is the classic case: it began as research work, spread "
      "because it was free, open and already implemented, and today a device that cannot speak "
      "TCP/IP is effectively unusable on the internet [5]. In practice the two kinds overlap. "
      "TCP/IP later acquired a formal home in the IETF, so a standard that started by fact ended "
      "up documented by an organisation, while USB and the PDF format are everyday examples of de "
      "facto standards that were never voted on by a treaty body."),

('h2', 'Q6. Six standards organisations'),
('p', "The six organisations in Table 1 do different jobs. IEEE and ISO write technical standards "
      "for how equipment and protocols behave. ITU-T, as part of the United Nations, writes the "
      "standards that telephone and telecom operators work to. The IETF writes the protocols of "
      "the internet and publishes them as RFCs. ANSI coordinates standards in the United States "
      "and usually adopts international ones rather than inventing new ones. EIA/TIA is an "
      "industry association of manufacturers, and its cabling documents are the ones followed in "
      "practice when a network is installed."),
('tbl', {
    'caption': 'Table 1: Standards organisations and one document each is known for.',
    'header': ['Organisation', 'Full name', 'Scope of work', 'Known standard or document'],
    'widths': [0.155, 0.245, 0.28, 0.32],
    'split': True,
    'rows': [
        ['IEEE', 'Institute of Electrical and Electronics Engineers',
         'Professional body, international. Local and metropolitan area networks, mainly the 802 series.',
         'IEEE 802.3 (Ethernet)<br/>IEEE 802.11 (Wi-Fi)'],
        ['ISO', 'International Organization for Standardization',
         'Voluntary standards body with national members; broad, not only computing.',
         'ISO/IEC 7498-1 (the OSI reference model)'],
        ['ITU-T', 'International Telecommunication Union, Telecommunication Standardization Sector',
         'Treaty organisation of the UN; standards for telecom networks and operators (formerly CCITT).',
         'ITU-T X.200<br/>ITU-T G.992 (ADSL)'],
        ['IETF', 'Internet Engineering Task Force',
         'Open international community of engineers; internet protocols published as RFCs.',
         'RFC 791 (IP)<br/>RFC 793 (TCP)'],
        ['ANSI', 'American National Standards Institute',
         'National standards body of the United States; approves and coordinates national standards.',
         'ANSI/TIA-568 (structured cabling)<br/>ANSI X3.263 (FDDI)'],
        ['EIA/TIA', 'Electronic Industries Alliance / Telecommunications Industry Association',
         'US industry associations of manufacturers of electronic and telecom equipment.',
         'TIA/EIA-568-B (T568A and T568B wiring)<br/>EIA/TIA-232 (RS-232)'],
    ],
}),
('p', "Two of these bodies matter more than the others in a first course, so it is worth being "
      "clear about them. IEEE 802.3 is the reason a cable made in one country works in a switch "
      "made in another, and RFC 791 is the reason a packet written by one operating system is "
      "understood by a router running another. ANSI and EIA/TIA are national bodies, but the "
      "cabling standard they publish is used in Ethiopia and everywhere else, which shows how a "
      "national document can become an international habit."),

# ------------------------------------------------------------------ D
('h1', 'Section D: Reference Models'),

('h2', 'Q7. The seven layers of the OSI model'),
('p', "The OSI reference model was published by ISO as a way of describing communication between "
      "two systems without tying the description to one manufacturer. It divides the work into "
      "seven layers, and each layer uses the services of the layer below it while offering "
      "services to the layer above [6]. Figure 2 shows the stack with the data unit that belongs "
      "to each layer."),
('fig', 'osi', 'Figure 2: The seven OSI layers, with the data unit handled at each layer.'),
('p', "The <b>application layer</b> (layer 7) is the one closest to the user. It does not mean the "
      "word processor or the browser itself; it means the part of the network software that those "
      "programs call, such as file transfer, electronic mail and web access. Its data unit is "
      "still called data, and HTTP, SMTP and FTP work here."),
('p', "The <b>presentation layer</b> (layer 6) deals with the form of the data and not its "
      "meaning. It handles character encoding, compression and encryption, so that a JPEG photo, "
      "an Amharic text file and a compressed archive can all be carried as a stream of bits. TLS "
      "and the media codecs are practical examples of work done at this layer."),
('p', "The <b>session layer</b> (layer 5) opens, manages and closes the dialogue between two "
      "applications. It keeps track of whose turn it is to send, and of where to resume if the "
      "connection breaks. Remote procedure calls and the session handling of a video conference "
      "belong here."),
('p', "The <b>transport layer</b> (layer 4) takes the message from the layers above, cuts it into "
      "segments, numbers them and delivers each one to the correct process on the destination "
      "machine using port numbers. It also decides whether delivery must be reliable, as with TCP, "
      "or fast and best effort, as with UDP. The data unit is the segment."),
('p', "The <b>network layer</b> (layer 3) moves a packet from the source host to the destination "
      "host, possibly across several different networks. It adds logical addresses, chooses a "
      "route and forwards the packet one hop at a time. IP and ICMP are the protocols, a router is "
      "the device, and the data unit is the packet."),
('p', "The <b>data link layer</b> (layer 2) takes that packet and wraps it in a frame carrying MAC "
      "addresses, detects errors on the link and controls access to a shared medium. Ethernet and "
      "PPP are the protocols, a switch and a network card work here, and the data unit is the "
      "frame."),
('p', "The <b>physical layer</b> (layer 1) transmits the bits as signals over the medium and "
      "defines the connectors, voltages, timing and data rate. Cables, hubs, repeaters and radio "
      "belong to this layer, and its data unit is the bit."),

('h2', 'Q8. The TCP/IP model and its mapping to OSI'),
('p', "The TCP/IP model describes the same job with four layers [2]. The <b>application layer</b> "
      "merges what OSI calls application, presentation and session, because in real software the "
      "program that speaks HTTP or SMTP also handles its own encoding and its own dialogue and "
      "does not need a separate layer for them. The <b>transport layer</b> is almost identical in "
      "both models and provides end-to-end delivery with TCP or UDP. The <b>internet layer</b> "
      "matches the OSI network layer and is dominated by IP, which addresses hosts and routes "
      "packets between networks. The <b>network access layer</b> covers the OSI data link and "
      "physical layers, because in practice the driver and the hardware that put bits on the wire "
      "are written and shipped together."),
('fig', 'tcpip', 'Figure 3: The four TCP/IP layers mapped onto the seven OSI layers.'),
('p', "Some textbooks use a five-layer version, which splits the network access layer into data "
      "link and physical. The mapping is the same, and the five-layer form is convenient when the "
      "two lowest layers are studied separately."),
('p', "TCP/IP is preferred in practice for several reasons. It was developed and tested on real "
      "networks before it was written down, so it was shaped by what hardware could actually do, "
      "while OSI was designed as a model and its protocols came later. It is implemented in every "
      "operating system, usually inside the kernel, so a program that wants to use the network "
      "almost never needs extra software. It is open and free, since the specifications are "
      "published as RFCs and anybody may implement them. It was built to keep working when part of "
      "the network disappears, because packets can be routed around a failure. And it scales "
      "without change from a two-PC laboratory to the whole internet, which is the strongest "
      "argument of all. OSI remains valuable as a teaching and troubleshooting tool, and that is "
      "how it is used in this paper."),

('h2', 'Q9. Comparison of the OSI and TCP/IP models'),
('p', "Table 2 compares the two models using the criteria that matter most in practice."),
('tbl', {
    'caption': 'Table 2: OSI and TCP/IP compared.',
    'header': ['Criterion', 'OSI model', 'TCP/IP model'],
    'widths': [0.23, 0.385, 0.385],
    'rows': [
        ['Number of layers', 'Seven', 'Four (five in the academic version)'],
        ['Development approach',
         'Written first as a general reference model by ISO, then protocols were designed for it.',
         'Protocols were designed and tested first; the model was written afterwards to describe '
         'what already worked.'],
        ['Protocol dependence',
         'Independent of any protocol suite; any suite can be described in it.',
         'Built around TCP/IP itself, so the model and the suite share one name.'],
        ['Practical use',
         'Reference, teaching, documentation and troubleshooting layer by layer.',
         'The model actually implemented in operating systems and on the internet.'],
        ['Upper layers and guarantees',
         'Session and presentation are separate layers; the transport layer may be connection '
         'oriented or connectionless.',
         'Application covers layers 5 to 7; TCP gives reliable delivery and UDP gives best effort, '
         'both inside the transport layer.'],
    ],
}),
('p', "The difference that shows up first in a laboratory is the practical one. When a link does "
      "not work, an engineer walks the OSI stack from layer 1 upwards, checking the cable, then "
      "the MAC address, then the IP configuration, because that order separates the possible "
      "causes. The software that he is testing, however, is organised in four TCP/IP layers, and "
      "the two views have to be translated in his head."),

# ------------------------------------------------------------------ E
('h1', 'Section E: Network Components'),

('h2', 'Q10. Six network components and the layer each one works at'),
('p', "A network is built from end devices, which people use, intermediary devices, which move "
      "the data, and the medium, which carries it. The six components are described one by one "
      "below, and Figure 4 shows all of them in one small network."),
('p', "The <b>personal computer</b> is the end device most users know best. It creates or consumes "
      "the data, and it runs all seven OSI layers, from the application that the user sees down to "
      "the network card that drives the cable. Its function is to be the source or the destination "
      "of the traffic, so it is a host and not an intermediary device."),
('p', "The <b>server</b> is also an end device, but a specialised one. It stays on, holds shared "
      "resources such as files, a database, a website or the university portal, and answers many "
      "clients at once. Its work is mainly at the application layer, although a server also has "
      "the lower layers because it needs them to be reachable."),
('p', "The <b>switch</b> is an intermediary device that works at layer 2. It learns which MAC "
      "address is reachable through which port and forwards each frame only to that port, which "
      "removes most of the unnecessary traffic in a laboratory and gives every port its own "
      "collision domain. A hub, which works at layer 1 and simply repeats a signal out of every "
      "other port, is the older and cruder version of the same idea and is compared in Q11."),
('p', "The <b>router</b> works at layer 3. It joins different networks, reads the destination IP "
      "address in each packet, looks the address up in its routing table and sends the packet to "
      "the next hop. It is the device that lets a laboratory reach the internet, and by default it "
      "stops broadcasts from crossing between networks."),
('p', "The <b>access point</b> works at layer 2 and bridges the wireless and wired parts of a "
      "network. It converts frames to radio signals and back, and it coordinates the stations "
      "around it so that they do not all transmit at the same moment. A laptop is not plugged into "
      "anything, but it is on the same local network as the wired PCs once the access point has "
      "associated it."),
('p', "The <b>transmission medium</b> is layer 1. UTP cable is the usual choice inside a building "
      "because it is cheap, easy to terminate and good for up to about 100 metres per run. Optical "
      "fibre is used for longer runs and for links between buildings because light in glass is not "
      "affected by the electrical noise that disturbs copper. Wireless uses free space, which "
      "removes the cable but brings interference, walls and the need to share the air with other "
      "users. The medium is a component in its own right, because a perfectly configured switch "
      "cannot carry traffic over a cable that is cut."),

('fig', 'network', 'Figure 4: End devices, intermediary devices and the medium in a small network.'),
('h2', 'Q11. Hub, switch and router compared'),
('p', "The three devices are often confused because they all have several ports and all \"connect\" "
      "things, but they read different addresses and they forward differently. A short example "
      "shows the difference, and Table 3 at the end of the answer puts the three side by side."),
('p', "A short example makes the difference concrete. Suppose three PCs and a server are connected "
      "to a switch, and PC 1 sends a frame to the server. The hub version of that network would "
      "send the frame to PC 2 and PC 3 as well, and both would have to throw it away. The switch "
      "sends it only to the server port, because it has learned where the server's MAC address "
      "lives. If PC 1 then sends a packet to a web server on the internet, the destination MAC "
      "belongs to the router, so the switch hands the packet to the router, and only the router "
      "looks at the destination IP address and decides which way the packet leaves the building."),

('tbl', {
    'caption': 'Table 3: How a hub, a switch and a router forward data.',
    'header': ['Feature', 'Hub', 'Switch', 'Router'],
    'widths': [0.20, 0.25, 0.28, 0.27],
    'rows': [
        ['How it forwards',
         'Repeats the incoming signal out of every other port. Reads no address at all.',
         'Reads the destination MAC address, looks it up in its table and sends the frame out of '
         'one port only.',
         'Reads the destination IP address, consults its routing table and forwards the packet to '
         'the next hop.'],
        ['OSI layer', 'Layer 1, physical', 'Layer 2, data link', 'Layer 3, network'],
        ['Collision domain',
         'One domain shared by all ports. Devices compete for the medium.',
         'One domain per port, so full duplex is possible and collisions disappear.',
         'One per interface. Also separates broadcast domains.'],
        ['Broadcast domain',
         'One, shared by every port.',
         'One, shared by all ports unless VLANs are configured.',
         'One per interface by default; broadcasts are not forwarded.'],
        ['Typical use',
         'Legacy networks, cheap extension of one segment, teaching.',
         'Connecting PCs, printers and access points inside a LAN.',
         'Connecting a LAN to another network or to the internet.'],
    ],
}),
# ------------------------------------------------------------------ F
('h1', 'Section F: Classification of Networks'),

('h2', 'Q12. PAN, LAN, MAN and WAN'),
('p', "Networks are classified by the geographical area they cover, because the area decides the "
      "technology, the cost and who owns the equipment [3]."),
('p', "A <b>personal area network (PAN)</b> covers the space around one person, roughly ten metres. "
      "The technology is Bluetooth, Wi-Fi Direct or a short USB cable, and the classic example is a "
      "phone connected to wireless earbuds and a smart watch. A PAN is normally owned by the person "
      "and needs no administrator."),
('p', "A <b>local area network (LAN)</b> covers a room, a building or a campus, normally up to about "
      "one kilometre. The technology is Ethernet over UTP cable for the fixed devices and Wi-Fi for "
      "the mobile ones, with a switch in each room and a router at the edge. The computer "
      "laboratory of a university or the network in a home are typical examples. A LAN is owned and "
      "managed by one organisation, which makes it fast and comparatively easy to secure."),
('p', "A <b>metropolitan area network (MAN)</b> covers a city, from a few kilometres to about fifty. "
      "The technology is usually optical fibre in a ring or a mesh, sometimes combined with "
      "microwave links where fibre cannot be laid. A real example is the fibre that joins the "
      "different campuses of a university across Addis Ababa, or the metro network that a telecom "
      "operator runs between its exchanges. A MAN is usually owned by a telecom operator or by a "
      "large organisation, and it is the layer at which several LANs are joined."),
('p', "A <b>wide area network (WAN)</b> covers a country, a continent or the whole world. The "
      "technology is leased lines, MPLS, undersea fibre and satellite links, and the internet is "
      "the largest example. A bank whose branches in Addis Ababa, Hawassa and Mekelle all reach the "
      "same central database over the operator's network is running a WAN. The links are expensive, "
      "the delay is higher, and the organisation does not own the infrastructure, which is why WAN "
      "design puts so much weight on redundancy."),

('h2', 'Q13. Classification by topology and by relationship'),
('p', "A topology is the way the nodes and links are arranged. It is physical when it describes the "
      "cabling and logical when it describes the path the data takes, and the two are not always "
      "the same. Figure 5 shows the five common physical topologies."),
('fig', 'topologies', 'Figure 5: The five physical topologies.'),
('p', "In a <b>bus</b> topology all devices tap into one backbone cable, and terminators at both "
      "ends absorb the signal so that it does not reflect back. It needs very little cable and it "
      "is simple to extend, which made it popular for early Ethernet. Its weakness is that one "
      "break in the backbone stops the whole segment, every device shares one collision domain, "
      "and finding the fault means checking the cable tap by tap."),
('p', "In a <b>star</b> topology every device has its own cable to a central switch or hub. A "
      "faulty cable affects one device only, a new device is added by plugging in one more port, "
      "and faults are easy to find because each device has its own link. The weakness is the "
      "centre: if the switch fails, the whole star goes down, so the central device has to be "
      "reliable. This is the topology of almost every laboratory and office LAN today."),
('p', "In a <b>ring</b> topology each device is connected to two neighbours and the links form a "
      "closed loop. Access can be controlled in a fixed order, which gives predictable performance "
      "under load, and a dual ring can survive one break by wrapping the other way. A single ring "
      "stops at the first break, and adding or removing a device interrupts the loop. Fibre rings "
      "are still used in metropolitan networks for exactly this reason."),
('p', "In a <b>mesh</b> topology the nodes are connected to several others, and in a full mesh "
      "every node is connected to every other node. There is always another path, so a single "
      "failure does not stop communication, and traffic can be balanced across links. The cost is "
      "the number of links, which grows as n(n-1)/2, together with the number of ports and the "
      "effort of managing them. Full mesh is used in the core of WANs and in wireless mesh "
      "networks; partial mesh is the practical compromise."),
('p', "A <b>hybrid</b> topology combines the others, for example star wired floors joined by a "
      "fibre ring between buildings, or star LANs joined by a bus backbone. It is what real "
      "installations look like, because each part of a building has different needs, and it scales "
      "well. The disadvantage is design effort: a hybrid network is harder to document and a fault "
      "can be harder to trace than in a pure star."),
('p', "The second classification is by relationship between the participants. In a "
      "<b>peer-to-peer</b> network all nodes are equal: each one can share its own files or printer "
      "and each one can use the shares of the others, with no central server. It is cheap, needs no "
      "specialist administrator and is convenient for two or three computers in a small office. It "
      "does not scale, because every node has to know about the others, and security and backup are "
      "as good as the least careful user. In a <b>client-server</b> network one dedicated machine "
      "provides services and the clients request them. Accounts, permissions, backups and updates "
      "are controlled in one place, which is why universities, banks and hospitals work this way. "
      "The cost is the server, its licence and the administrator, and the server becomes a single "
      "point of failure unless it is duplicated. Figure 6 shows both arrangements."),
('fig', 'relationship', 'Figure 6: Peer-to-peer and client-server relationships.'),

# ------------------------------------------------------------------ G
('h1', 'Section G: Personal Reflection'),

('h2', 'Q14. How networking helps me, and what it costs me'),
('p', "My studies depend on the network more than I expected when I joined the university. The "
      "lecture notes, the assignments and the announcements all live on the e-learning portal, so "
      "a day without internet is a day without the course material. Our section has a Telegram "
      "group where one person photographs the board and everybody else gets the notes within "
      "minutes, and a question that would have waited until the next class is answered at ten at "
      "night. For programming courses I use GitHub to keep my code, and when a compiler error makes "
      "no sense I search for it and usually find somebody who had the same problem. Google Scholar "
      "gives me papers for assignments like this one, and the online library saves a trip to the "
      "main campus. My results, my registration and my payment records are all online now, which "
      "is faster and removes a queue."),
('p', "Outside class the benefit is the same in a different form. Telebirr lets me pay for a taxi "
      "or send money home without carrying cash, video calls keep me in contact with relatives who "
      "are far away, and I can follow news and tutorials in Amharic and English whenever I have "
      "time. Even simple things, such as checking whether a road is closed or looking up the price "
      "of a part before going to the shop, save hours that used to be spent travelling."),
('p', "The costs are real as well. The first is attention. I open the phone to check one "
      "announcement and come back forty minutes later, having watched videos that had nothing to "
      "do with the assignment, and the homework that was supposed to take one hour takes three. "
      "The second is the temptation to copy. When the answer to a lab exercise is one search away, "
      "it is easy to submit something that works without understanding why, and the loss only "
      "appears in the final exam and later in an interview. The third is trust: forwarded messages "
      "in family groups are often false, and I have received a message that looked like a telebirr "
      "notification and was not. The fourth is privacy, because photographs and opinions posted "
      "once stay available for a long time, and the fifth is dependence, since when the connection "
      "or the power fails I feel that I cannot study at all, which is a weakness I did not have "
      "before."),
('p', "What I take from this course so far is that the technology itself is neutral. The same "
      "network that gives me a lecture at midnight also gives me four hours of distraction. Using "
      "it well is a skill that has to be practised, the same as writing code, and it starts with "
      "deciding what I opened the phone to do before I open it."),

# ------------------------------------------------------------------ H
('h1', 'Section H: Physical Layer and Data Link Layer'),

('h2', 'Q15. Functions of the physical layer'),
('p', "The physical layer is the lowest layer of the OSI model, and its job is to carry the bits of "
      "the layer above across a medium. It deals with the hardware, the signal and the timing, and "
      "its data unit is the bit, or more exactly the bit stream [1]."),
('p', "<b>Bit representation</b> is the first function. The layer must decide how a 0 and a 1 are "
      "written on the medium, and that choice is the encoding. A copper cable carries them as "
      "voltage levels, an optical fibre as pulses of light and free space as changes in a radio "
      "wave. Encodings such as NRZ, Manchester and 4B/5B differ in how easy they are to "
      "synchronise and how much bandwidth they need, and the choice belongs to this layer because "
      "it is tied to the medium."),
('p', "<b>Data rate</b> is the second. The layer fixes how many bits are sent per second, which "
      "also fixes how long one bit lasts on the line. The rate is limited by the medium and by the "
      "transmitter, and it is agreed by both ends before the transfer starts. A 100 Mbps link and a "
      "1 Gbps link may use the same cable category, but the receiver must know which rate to "
      "expect."),
('p', "<b>Synchronisation</b> is the third. The sender and receiver clocks are separate, and they "
      "drift, so the receiver has to know where one bit ends and the next begins. This is done by "
      "agreeing on the bit duration, by embedding timing information in the signal as a Manchester "
      "code does, or by sending a preamble whose only purpose is to let the receiver lock on. "
      "Without it the receiver would sample in the wrong places and read nonsense."),
('p', "<b>Physical topology</b> is the fourth. The layer defines how the devices and the medium are "
      "physically arranged: point to point between two devices, multipoint on a shared line, or a "
      "star, ring, bus or mesh. The physical arrangement is not the same thing as the logical "
      "topology, since a modern star wired LAN can behave logically like a bus inside an old hub."),
('p', "<b>Transmission mode</b> is the fifth. Simplex allows one direction only, as in a keyboard "
      "or a radio broadcast. Half duplex allows both directions but only one at a time, as in a "
      "walkie-talkie. Full duplex allows both directions at once, as in a telephone call or a "
      "switched Ethernet link. Figure 7 shows the three modes."),
('p', "The data unit of the physical layer is the bit. Everything above it has already been turned "
      "into a stream of 0s and 1s by the time it reaches this layer, so the physical layer never "
      "looks at addresses, frames or packets; it only moves bits and makes sure the other end can "
      "recognise them."),

('fig', 'modes', 'Figure 7: Simplex, half-duplex and full-duplex transmission.'),
('h2', 'Q16. Functions of the data link layer'),
('p', "The data link layer sits above the physical layer and is responsible for delivery of a frame "
      "from one node to the next over a single link. It hides the details of the medium from the "
      "network layer and its data unit is the frame [1]."),
('p', "<b>Framing</b> is its first function. The stream of bits arriving from the physical layer "
      "has no natural boundaries, so the data link layer groups the bits into frames and marks "
      "where each frame begins and ends, usually with a flag or with a length field. The frame "
      "carries a header, the payload handed down by the network layer, and a trailer. Figure 8 "
      "shows the parts."),
('fig', 'frame', 'Figure 8: The parts of a frame, the data unit of the data link layer.'),
('p', "<b>Physical addressing</b> is the second. Each frame carries the MAC address of the "
      "destination and of the source, so that the receiving card can tell whether the frame is for "
      "it. The MAC address is burned into the network card by the manufacturer and is used only "
      "inside the local link; as soon as the packet crosses a router, the addresses change while "
      "the IP addresses stay the same."),
('p', "<b>Flow control</b> is the third. A fast sender can fill a slow receiver, and the data link "
      "layer prevents that by making the sender wait for acknowledgements or by advertising a "
      "window of how much can be accepted. Sliding window protocols do this efficiently, keeping "
      "several frames in flight without letting the receiver run out of buffer."),
('p', "<b>Error control</b> is the fourth, and it has two halves. Error detection adds a checksum "
      "such as a CRC in the trailer, so that the receiver can tell that a frame was damaged by "
      "noise and must be thrown away. Error correction goes further and arranges for damaged "
      "frames to be sent again, using acknowledgements and timers, or for the receiver to repair a "
      "limited number of bad bits using forward error correction. <b>Access control</b> is closely "
      "related, because when several stations share one medium the layer has to decide whose turn "
      "it is, and it does so with CSMA/CD on old wired Ethernet and CSMA/CA on Wi-Fi."),
('p', "The layer is formally divided into two sublayers. The <b>logical link control (LLC)</b> "
      "sublayer is the upper half: it handles framing, flow control and error control, and it "
      "provides one interface to the network layer above, whatever hardware is used below. The "
      "<b>medium access control (MAC)</b> sublayer is the lower half: it deals with physical "
      "addressing and with the rules for taking a turn on the shared medium, and it is the part "
      "that changes when the hardware changes. That is why the same network layer software can run "
      "over Ethernet, Wi-Fi or fibre without being rewritten. The data unit of the whole layer is "
      "the frame, and a frame that reaches its destination with a good checksum is passed up as a "
      "packet."),

# ------------------------------------------------------------------ refs
('h1', 'References'),
('refs', [
    "B. A. Forouzan, <i>Data Communications and Networking</i>, 5th ed. New York: McGraw-Hill, "
    "2013.",
    "A. S. Tanenbaum and D. J. Wetherall, <i>Computer Networks</i>, 5th ed. Boston: Pearson, 2011.",
    "J. F. Kurose and K. W. Ross, <i>Computer Networking: A Top-Down Approach</i>, 7th ed. Harlow: "
    "Pearson, 2017.",
    "IEEE, <i>IEEE Standard for Ethernet</i>, IEEE Std 802.3-2018, Piscataway, NJ, 2018.",
    "J. Postel, \"Internet Protocol\", RFC 791, IETF, September 1981.",
    "ISO/IEC, <i>Information Technology - Open Systems Interconnection - Basic Reference Model: "
    "The Basic Model</i>, ISO/IEC 7498-1:1994, Geneva, 1994.",
]),
]
