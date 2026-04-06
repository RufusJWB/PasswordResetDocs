# Nunc eget lorem

Nunc eget lorem dolor sed viverra ipsum nunc aliquet bibendum. Egestas integer eget aliquet nibh
praesent tristique magna sit. Hac habitasse platea dictumst quisque sagittis purus sit amet.

Etiam non quam lacus suspendisse faucibus interdum posuere lorem. Imperdiet sed euismod nisi
porta lorem mollis aliquam. Nunc sed augue lacus viverra vitae congue eu.
Amet nisl suscipit adipiscing bibendum est ultricies integer quis auctor. Eget arcu dictum
varius duis at consectetur lorem donec. Amet luctus venenatis lectus magna fringilla.

Aliquet nec ullamcorper sit amet risus nullam eget felis. Odio pellentesque diam volutpat
commodo sed egestas egestas fringilla phasellus. Eget velit aliquet sagittis id
consectetur purus. Nunc sed augue lacus viverra vitae congue eu consequat.

## Non curabitur gravida arcu

Nunc sed augue lacus viverra vitae congue:

```sh
# Tellus mauris a diam maecenas sed enim ut sem viverra.
pip maecenas --viverra poetry
```

Sit amet commodo nulla facilisi nullam vehicula ipsum:

```sh
poetry maecenas --viverra --no-root
```

Arcu cursus euismod quis viverra nibh. .

Habitasse platea dictumst vestibulum rhoncus est pellentesque.

```mermaid
  graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
```

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
culpa qui officia deserunt mollit anim id est laborum.

```mermaid
  graph TB

    SubGraph1 --> SubGraph1Flow
    subgraph "SubGraph 1 Flow"
    SubGraph1Flow(SubNode 1)
    SubGraph1Flow -- Choice1 --> DoChoice1
    SubGraph1Flow -- Choice2 --> DoChoice2
    end

    subgraph "Main Graph"
    Node1[Node 1] --> Node2[Node 2]
    Node2 --> SubGraph1[Jump to SubGraph1]
    SubGraph1 --> FinalThing[Final Thing]
  end
```

### Sequence diagram

```mermaid
sequenceDiagram
    Inner Source Component-->>First Reuser: no tax relevance yet
    Inner Source Component->>Second Reuser: initial value estimated using all commits
    Note over First Reuser,Second Reuser: if distinct legal entities are involved
    Inner Source Component->>Subsequent Reuser: value gain estimated using new commits
    Note over First Reuser,Subsequent Reuser: new computation of royalties and discounts required
```

## PlantUML

```plantuml

Alice -> "Bob()" : Hello
"Bob()" -> "This is very\nlong" as Long
' You can also declare:
' "Bob()" -> Long as "This is very\nlong"
Long --> "Bob()" : ok

```

While loop


```plantuml
title While Loop - Activity Diagram

start

while (Hungry?)  is (Yes)
:Eat Hot Wings;
:Drink Homebrew;
endwhile (No)
:Go To Sleep;
stop
```

Sequence Diagram

```plantuml
title "Messages - Sequence Diagram"

actor User
boundary "Web GUI" as GUI
control "Shopping Cart" as SC
entity Widget
database Widgets

User -> GUI : To boundary
GUI -> SC : To control
SC -> Widget : To entity
Widget -> Widgets : To database
```

C4PlantUML

```c4plantuml
!include C4_Context.puml

LAYOUT_WITH_LEGEND()

title System Context diagram for Internet Banking System

Person(customer, "Personal Banking Customer", "A customer of the bank, with personal bank accounts.")
System(banking_system, "Internet Banking System", "Allows customers to view information about their bank accounts, and make payments.")

System_Ext(mail_system, "E-mail system", "The internal Microsoft Exchange e-mail system.")
System_Ext(mainframe, "Mainframe Banking System", "Stores all of the core banking information about customers, accounts, transactions, etc.")

Rel(customer, banking_system, "Uses")
Rel_Back(customer, mail_system, "Sends e-mails to")
Rel_Neighbor(banking_system, mail_system, "Sends e-mails", "SMTP")
Rel(banking_system, mainframe, "Uses")

```

With paths

```plantuml
@startuml

left to right direction

actor user
actor mkdocs_server
actor plantuml_server

user --> (1. modifies content of docs)
user --> mkdocs_server
mkdocs_server --> (2. builds page and reloads browser)
mkdocs_server --> plantuml_server
plantuml_server --> (3. renders svg)
(3. renders svg) --> mkdocs_server
```

Polygons

```plantuml
@startuml
start
repeat
  :read input data;
  :execute control logic;
  :write output data;
repeat while (stop execution?) is (no)
->yes;
stop
@enduml
```

More polygons:

```plantuml
@startuml
skinparam defaulttextalignment center
node "real-time\nAutomation App" <<cpp>> as rtapp {
    component "Business Logic" as bl
    component "real-time\nBusiness Logic" as rtbl
    interface "API"
    package "OIE real-time Library" as lib {
      component "oie::sdk::rsc" as sdk
    }

}

component "RSC Services" as services
interface "DDS"
component "External Application" as extapp

bl -d-> API : use
API -u-> rtbl : call
sdk -u-> API : provide
sdk <-.l-> services
services -.u-> DDS : publish\nreal-time\ninformation
extapp <-.r- DDS
@enduml
```

With Model Attributes:

```plantuml
@startuml
package "Object Model" #white
{
    abstract class Object #whitesmoke ##blue
    {
        * name : Ident
        ..
        + description : Ident
        + elements : Element
    }

    abstract class Element #whitesmoke ##blue
    {
        * name : Ident
        ..
        * dataType : UInt32
        + unit : String
    }
    Object  *-- "*" Element #blue
}
@enduml
```
