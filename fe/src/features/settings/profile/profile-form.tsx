import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { showSubmittedData } from '@/utils/show-submitted-data'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  Slider,
} from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// 修正: 確保 schema 和 defaultValues 一致
// 定義 LLM 配置的 schema - 修改可選欄位的定義方式
const llmConfigSchema = z.object({
  // 模型選擇
  model: z.string({
    required_error: "請選擇一個模型",
  }),
  
  // 主要參數
  temperature: z.number({
    required_error: "溫度值是必需的",
  }).min(0).max(2),
  
  top_p: z.number({
    required_error: "Top P 是必需的",
  }).min(0).max(1),
  
  max_tokens: z.number({
    required_error: "最大 Token 數是必需的",
  }).min(1).max(8192),
  
  // 額外參數 - 修正為必填欄位，與 form 控制項一致
  frequency_penalty: z.number().min(-2).max(2),
  presence_penalty: z.number().min(-2).max(2),
  
  // 提示詞
  system_prompt: z.string().max(10000).optional(),
  user_prompt_template: z.string().max(10000).optional(),
  
  // 對話設置 - 修正為必填欄位，與 form 控制項一致
  stream_response: z.boolean(),
  save_history: z.boolean(),
  
  // 配置名稱
  config_name: z.string().min(1, {
    message: "請為您的配置命名",
  }).max(50)
})

// 修正: 使用正確的類型定義
type LLMConfigValues = z.infer<typeof llmConfigSchema>

// 確保所有必須欄位都有默認值
const defaultValues: LLMConfigValues = {
  model: "gpt-4-turbo",
  temperature: 0.7,
  top_p: 1.0,
  max_tokens: 2048,
  frequency_penalty: 0,
  presence_penalty: 0,
  system_prompt: "您是一個有幫助的助手。請準確、簡潔地回答用戶的問題。",
  user_prompt_template: "",
  stream_response: true,
  save_history: true,
  config_name: "我的預設配置"
}

export default function LLMConfigForm() {
  // 修正: 確保泛型參數與 zod schema 匹配
  const form = useForm<LLMConfigValues>({
    resolver: zodResolver(llmConfigSchema),
    defaultValues,
    mode: 'onChange',
  })

  // 格式化滑塊值的輔助函數
  const formatSliderValue = (value: number) => {
    return value.toFixed(2)
  }


  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => showSubmittedData(data))}
        className='space-y-6'
      >
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="general">基本設置</TabsTrigger>
            <TabsTrigger value="advanced">高級參數</TabsTrigger>
            <TabsTrigger value="prompts">提示詞設計</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>基本 LLM 配置</CardTitle>
                <CardDescription>
                  配置您的 LLM 基本設置
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 模型選擇 */}
                  <FormField
                    control={form.control}
                    name='model'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>模型</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='選擇一個模型' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='gpt-4-turbo'>GPT-4 Turbo</SelectItem>
                            <SelectItem value='gpt-4'>GPT-4</SelectItem>
                            <SelectItem value='gpt-3.5-turbo'>GPT-3.5 Turbo</SelectItem>
                            <SelectItem value='claude-3-opus'>Claude 3 Opus</SelectItem>
                            <SelectItem value='claude-3-sonnet'>Claude 3 Sonnet</SelectItem>
                            <SelectItem value='claude-3-haiku'>Claude 3 Haiku</SelectItem>
                            <SelectItem value='llama-3-70b'>Llama 3 70B</SelectItem>
                            <SelectItem value='llama-3-8b'>Llama 3 8B</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          選擇您想要使用的 LLM 模型
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 配置名稱 */}
                  <FormField
                    control={form.control}
                    name='config_name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>配置名稱</FormLabel>
                        <FormControl>
                          <Input placeholder='我的自定義配置' {...field} />
                        </FormControl>
                        <FormDescription>
                          為您的配置取一個獨特的名稱，以便稍後使用
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Temperature & Top P in a grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {/* Temperature */}
                  <FormField
                    control={form.control}
                    name='temperature'
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between">
                          <FormLabel>溫度值</FormLabel>
                          <Badge variant="outline">{formatSliderValue(field.value)}</Badge>
                        </div>
                        <FormControl>
                          <Slider
                            min={0}
                            max={2}
                            step={0.01}
                            value={[field.value]}
                            onValueChange={(values) => field.onChange(values[0])}
                          />
                        </FormControl>
                        <FormDescription>
                          控制隨機性。較低的值產生更聚焦和確定性的輸出，較高的值產生更多樣化和創意的結果。
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Top P */}
                  <FormField
                    control={form.control}
                    name='top_p'
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between">
                          <FormLabel>Top P</FormLabel>
                          <Badge variant="outline">{formatSliderValue(field.value)}</Badge>
                        </div>
                        <FormControl>
                          <Slider
                            min={0}
                            max={1}
                            step={0.01}
                            value={[field.value]}
                            onValueChange={(values) => field.onChange(values[0])}
                          />
                        </FormControl>
                        <FormDescription>
                          通過核採樣控制多樣性。較低的值使輸出更具焦點和確定性。
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>基本輸出設置</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Max Tokens */}
                  <FormField
                    control={form.control}
                    name='max_tokens'
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between">
                          <FormLabel>最大 Token 數</FormLabel>
                          <Badge variant="outline">{field.value}</Badge>
                        </div>
                        <FormControl>
                          <Slider
                            min={1}
                            max={8192}
                            step={1}
                            value={[field.value]}
                            onValueChange={(values) => field.onChange(values[0])}
                          />
                        </FormControl>
                        <FormDescription>
                          模型在單個回應中可以生成的最大標記數量。
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Stream Response */}
                  <FormField
                    control={form.control}
                    name='stream_response'
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">流式響應</FormLabel>
                          <FormDescription>
                            啟用以在生成過程中看到響應。
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>高級超參數</CardTitle>
                <CardDescription>
                  使用這些參數微調模型的行為
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Frequency Penalty */}
                  <FormField
                    control={form.control}
                    name='frequency_penalty'
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between">
                          <FormLabel>頻率懲罰</FormLabel>
                          <Badge variant="outline">{formatSliderValue(field.value)}</Badge>
                        </div>
                        <FormControl>
                          <Slider
                            min={-2}
                            max={2}
                            step={0.01}
                            value={[field.value]}
                            onValueChange={(values) => field.onChange(values[0])}
                          />
                        </FormControl>
                        <FormDescription>
                          通過懲罰生成文本中頻繁出現的標記來減少重複。
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Presence Penalty */}
                  <FormField
                    control={form.control}
                    name='presence_penalty'
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between">
                          <FormLabel>存在懲罰</FormLabel>
                          <Badge variant="outline">{formatSliderValue(field.value)}</Badge>
                        </div>
                        <FormControl>
                          <Slider
                            min={-2}
                            max={2}
                            step={0.01}
                            value={[field.value]}
                            onValueChange={(values) => field.onChange(values[0])}
                          />
                        </FormControl>
                        <FormDescription>
                          通過懲罰在生成文本中出現過的所有標記來減少重複。
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="mt-6">
                  {/* Save History */}
                  <FormField
                    control={form.control}
                    name='save_history'
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">保存對話歷史</FormLabel>
                          <FormDescription>
                            啟用以保存對話供以後參考。
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="prompts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>提示詞設計</CardTitle>
                <CardDescription>
                  配置系統和用戶提示詞模板
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* System Prompt */}
                <FormField
                  control={form.control}
                  name='system_prompt'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>系統提示詞</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='在此輸入您的系統指令...'
                          className='min-h-32'
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        這是給 LLM 的指令，用於指導其行為。它定義了助手的角色和能力。
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* User Prompt Template */}
                <FormField
                  control={form.control}
                  name='user_prompt_template'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>用戶提示詞模板</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='在此輸入您的用戶提示詞模板...'
                          className='min-h-32'
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        用於結構化用戶查詢的可選模板。使用 {"{{user_input}}"} 來指示用戶消息插入的位置。
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-4">
          <Button variant="outline">重置為預設值</Button>
          <Button type='submit'>保存配置</Button>
        </div>
      </form>
    </Form>
  )
}
