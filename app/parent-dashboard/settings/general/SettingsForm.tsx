"use client"

import { useState } from "react"
import { Button } from "@components/components/ui/button"
import { Input } from "@components/components/ui/input"
import { Label } from "@components/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@components/components/ui/radio-group"
import { useToast } from "../../../../components/hooks/use-toast"

export function SettingsForm() {
  const [name, setName] = useState("")
  const [phoneNumbers, setPhoneNumbers] = useState([""])
  const [enableNotifications, setEnableNotifications] = useState("no")

  const { toast } = useToast();

  const handleAddPhoneNumber = () => {
    setPhoneNumbers([...phoneNumbers, ""])
  }

  const handlePhoneNumberChange = (index: number, value: string) => {
    const updatedPhoneNumbers = [...phoneNumbers]
    updatedPhoneNumbers[index] = value
    setPhoneNumbers(updatedPhoneNumbers)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send this data to your backend
    console.log({ name, phoneNumbers, enableNotifications })
    toast({
      title: "Settings updated",
      description: "Your settings have been successfully updated.",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />
      </div>

      <div className="space-y-2">
        <Label>Phone Number</Label>
        {phoneNumbers.map((phoneNumber, index) => (
          <Input
            key={index}
            value={phoneNumber}
            placeholder="Enter phone number"
            className="mb-2"
          />
        ))}
        {/* <Button type="button" variant="outline" onClick={handleAddPhoneNumber}>
          Add Another Phone Number
        </Button> */}
      </div>

      <div className="space-y-2">
        <Label>Enable Phone Notifications</Label>
        <RadioGroup value={enableNotifications} onValueChange={setEnableNotifications}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="notifications-yes" />
            <Label htmlFor="notifications-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="notifications-no" />
            <Label htmlFor="notifications-no">No</Label>
          </div>
        </RadioGroup>
      </div>

      <Button type="submit">Save Settings</Button>
    </form>
  )
}

