"use client"
import {
    addEdge,
    Background,
    BackgroundVariant,
    Controls,
    Edge,
    MiniMap,
    Panel,
    ReactFlow,
    useEdgesState,
    useNodesState,
    Node,
} from "@xyflow/react"
import { useCallback } from "react"

import { cn } from "@/lib/ui-utils"
import { useSidenav } from "@/providers/sidenav-provider"
import "@xyflow/react/dist/style.css"
import CustomNode from "./_components/custom-node"
import { convertItemsToNodes } from "./_utils/convert-to-nodes"

const nodeTypes = {
    customNode: CustomNode,
}

export default function App() {
    const { isSidenavOpen } = useSidenav()
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

    const onConnect = useCallback(
        (params: any) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    )

    return (
        <div
            className={cn("h-[92vh] -mt-2 border border-gray-300 relative", {
                "w-[calc(100vw-306px)]": isSidenavOpen,
                "w-[calc(100vw-100px)]": !isSidenavOpen,
            })}
        >
            <ReactFlow
                nodeTypes={nodeTypes}
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
            >
                <Controls className="rounded-lg -translate-y-4 border border-gray-200" />
                <Panel position="bottom-right" className="bg-transparent">
                    <div className="rounded-lg shadow-lg overflow-hidden border border-gray-200">
                        <MiniMap
                            className="!bg-white/90 -translate-y-4 dark:!bg-gray-800/90"
                            style={{ height: 110, width: 170 }}
                            pannable
                            nodeBorderRadius={2}
                            nodeStrokeWidth={2}
                            nodeComponent={(nodeProps) => {
                                const { x, y, width, height } = nodeProps
                                return (
                                    <rect
                                        x={x}
                                        y={y}
                                        width={width}
                                        height={height}
                                        rx={4}
                                        className="fill-blue-400 dark:fill-blue-500 stroke-blue-400 dark:stroke-blue-400"
                                        strokeWidth={2}
                                    />
                                )
                            }}
                            maskColor="rgba(0, 0, 0, 0.1)"
                        />
                    </div>
                </Panel>
                <Background
                    variant={BackgroundVariant.Cross}
                    gap={12}
                    size={1}
                />
            </ReactFlow>
        </div>
    )
}

const items = [
    {
        title: "Object-Oriented Programming in Java",
        id: "OOP in Java",
        description: "Principles and techniques of OOP in Java",
        content:
            "Object-Oriented Programming (OOP) focuses on using objects and classes for software design.",
        subItems: [
            {
                title: "Classes & Objects",
                id: "Classes & Objects",
                description:
                    "The core of OOP, representing real-world entities.",
                content:
                    "Classes define object structure, and objects are instances of classes.",
                subItems: [
                    {
                        title: "Class Declaration",
                        id: "Class Declaration",
                        description: "Defining a class in Java.",
                        content: "class Person { String name; int age; }",
                        subItems: [],
                    },
                    {
                        title: "Object Instantiation",
                        id: "Object Instantiation",
                        description: "Creating an object from a class.",
                        content: "Person p = new Person();",
                        subItems: [],
                    },
                ],
            },
            {
                title: "Inheritance",
                id: "Inheritance",
                description: "Mechanism where one class inherits from another.",
                content:
                    "Allows the creation of new classes based on existing ones.",
                subItems: [
                    {
                        title: "extends keyword",
                        id: "extends keyword",
                        description: "Used to inherit a class in Java.",
                        content: "class Student extends Person { }",
                        subItems: [],
                    },
                    {
                        title: "extends keyword",
                        id: "aeaze",
                        description: "Used to inherit a class in Java.",
                        content: "class Student extends Person { }",
                        subItems: [],
                    },
                    {
                        title: "extends keyword",
                        id: "extenaeeazeeds keyword",
                        description: "Used to inherit a class in Java.",
                        content: "class Student extends Person { }",
                        subItems: [],
                    },
                    {
                        title: "extends keyword",
                        id: "azeaeee",
                        description: "Used to inherit a class in Java.",
                        content: "class Student extends Person { }",
                        subItems: [],
                    },
                ],
            },
            {
                title: "Polymorphism",
                id: "Polymorphism",
                description: "Ability of an object to take many forms.",
                content:
                    "Can be achieved through method overloading and overriding.",
                subItems: [
                    {
                        title: "Method Overloading",
                        id: "Method Overloading",
                        description:
                            "Defining multiple methods with the same name but different parameters.",
                        content: "int add(int a, int b) { return a + b; }",
                        subItems: [],
                    },
                    {
                        title: "Method Overriding",
                        id: "Method Overriding",
                        description: "Redefining a method in a subclass.",
                        content:
                            "@Override public void display() { System.out.println('Student'); }",
                        subItems: [],
                    },
                ],
            },
            {
                title: "Encapsulation",
                id: "Encapsulation",
                description:
                    "Hiding internal state and requiring all interaction through an object's methods.",
                content:
                    "Allows restricting access to certain components of an object.",
                subItems: [
                    {
                        title: "Getter & Setter Methods",
                        id: "Getter & Setter Methods",
                        description:
                            "Methods to access and modify object properties.",
                        content:
                            "public String getName() { return name; } public void setName(String name) { this.name = name; }",
                        subItems: [],
                    },
                ],
            },
            {
                title: "Abstraction",
                id: "Abstraction",
                description:
                    "Hiding complex implementation details while exposing only necessary features.",
                content: "Achieved through abstract classes or interfaces.",
                subItems: [
                    {
                        title: "Abstract Classes",
                        id: "Abstract Classes",
                        description:
                            "A class that cannot be instantiated, meant to be extended.",
                        content:
                            "abstract class Animal { abstract void sound(); }",
                        subItems: [],
                    },
                    {
                        title: "Interfaces",
                        id: "Interfaces",
                        description:
                            "Defines a contract for classes to implement.",
                        content: "interface Animal { void sound(); }",
                        subItems: [],
                    },
                ],
            },
        ],
    },
]

export type Item = {
    id: string
    title: string
    description: string
    content: string
    subItems: Item[]
}

const [initialNodes, initialEdges] = convertItemsToNodes(items, null)
